import type { Request, Response } from "express"
import user from "../models/auth.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { otpRequestSchema, otpVerifySchema } from "../types/auth.js"
import { createHmac, randomInt } from "node:crypto";
import verification from "../models/verification.js";
import { otpDeliveryConfigured, sendOtp } from "../utils/sendOtp.js";

export const Signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email })

    if (existingUser) {
      return res.status(404).json({ message: "User already exists" })
    };

    const hashedpassword = await bcrypt.hash(password, 12)
    const newuser = await user.create({ name, email, password: hashedpassword })
    // signing the jwt
    const token = jwt.sign({ email: newuser.email, id: newuser._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const { password: _password, ...profile } = newuser.toObject();
    res.status(200).json({ data: profile, token });
  } catch {
    res.status(500).json("something went wrong..");
    return;
  }
}

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // find if exists
    const exisitinguser = await user.findOne({ email });
    if (!exisitinguser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const ispasswordCorrect = await bcrypt.compare(
      password,
      exisitinguser.password
    );
    if (!ispasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // if correct password sign the jwt and return
    const token = jwt.sign(
      { email: exisitinguser.email, id: exisitinguser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    const { password: _password, ...profile } = exisitinguser.toObject();
    res.status(200).json({ data: profile, token });
  } catch {
    res.status(500).json("something went wrong while login");
    return;
  }
}

// not jwt required
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const alluser = await user.find().select("name about tags joinDate");
    res.status(200).json({ data: alluser });
  } catch (error) {
    res.status(500).json("something went wrong while getting all users");
    return;
  }
}

// Public user profile
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const profile = await user.findById(id).select("name about tags joinDate");
    if (!profile) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: profile });
  } catch {
    res.status(500).json({ message: "Could not load user" });
  }
};

// update user profile
export const updateprofile = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (_id !== req.userid) return res.status(403).json({ message: "You can only edit your own profile" });
  const { name, about, tags } = req.body?.editForm ?? {};
  if (typeof name !== "string" || !name.trim() || (about !== undefined && typeof about !== "string") || (tags !== undefined && (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")))) {
    return res.status(400).json({ message: "Invalid profile fields" });
  }

  if (Array.isArray(_id) || !_id) {
    return res.status(400).json({ message: "Invalid user ID format" }); // only string type is allowed
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "User unavailable" });
  }
  try {
    // else find the user
    const updateprofile = await user.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    ).select("name about tags joinDate");
    if (!updateprofile) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: updateprofile });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong while updating profile");
    return;
  }
};

export const verificationRequest = async (req: Request, res: Response) => {
  const { data, success } = otpRequestSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "wrong inputs sent"
    })
  }

  const { channel } = data;
  try {
    const account = await user.findById(req.userid);
    // some checks
    if (!account) return res.status(404).json({ message: "User not found" });
    if (account.isSuspended) return res.status(403).json({ message: "Account suspended" });
    const target = channel === "email" ? account.email : account.phone;
    if (!target) return res.status(400).json({ message: `Add a registered ${channel} first` });
    if (channel === "phone" && !/^\+[1-9]\d{7,14}$/.test(target)) {
      return res.status(400).json({ message: "Store your phone number with its country code, e.g. +919876543210" });
    }
    if (channel === "email" ? account.emailVerified : account.phoneVerified) {
      return res.status(409).json({ message: "This contact is already verified" });
    }
    if (!otpDeliveryConfigured(channel)) {
      return res.status(503).json({ message: `${channel} verification delivery is not configured` });
    }

    const now = new Date();
    const day = now.toISOString().slice(0, 10);
    const filter = { userId: req.userid, channel, purpose: "verify-contact" };
    await verification.init(); // Wait for the unique index before creating challenges.
    const previous = await verification.findOne(filter);

    // rate limit checks
    if (previous && now.getTime() - previous.lastSentAt.getTime() < 60000) {
      return res.status(429).json({ message: "Wait 60 seconds before requesting another code" });
    }
    if (previous?.day === day && previous.sendCount >= 5) {
      return res.status(429).json({ message: "Daily verification limit reached. Try again tomorrow" });
    }

    const code = randomInt(100000, 1000000).toString();
    const codeHash = hashOtp(req.userid, channel, target, code);
    const fields = {
      target, codeHash, expiresAt: new Date(now.getTime() + 5 * 60000), attempts: 0,
      usedAt: null, lastSentAt: now, day, sendCount: previous?.day === day ? previous.sendCount + 1 : 1,
    };
    // Match the old timestamp so concurrent requests cannot bypass the limits.
    let saved;
    if (previous) {
      saved = await verification.findOneAndUpdate(
        { _id: previous._id, lastSentAt: previous.lastSentAt },
        { $set: fields },
        { new: true }
      );
    } else {
      saved = await verification.create({ ...filter, ...fields });
    }
    if (!saved) return res.status(429).json({ message: "A code was just requested. Please wait" });

    try {
      await sendOtp(channel, target, code);
    } catch {
      await verification.updateOne({ _id: saved._id, codeHash }, { $set: { usedAt: new Date() } });
      return res.status(502).json({ message: "Could not send the code. Please try again after 60 seconds" });
    }
    res.status(200).json({ message: "Verification code sent", expiresIn: 300, resendAfter: 60 });
  } catch (error) {
    if ((error as { code?: number })?.code === 11000) {
      return res.status(429).json({ message: "A code was just requested. Please wait" });
    }
    res.status(500).json({ message: "Could not request verification" });
  }
};

function hashOtp(userId: string, channel: string, target: string, code: string) {
  return createHmac("sha256", process.env.JWT_SECRET!)
    .update(JSON.stringify([userId, channel, "verify-contact", target, code])).digest("hex");
}

export const verificationVerify = async (req: Request, res: Response) => {
  const parsed = otpVerifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Send a channel and a six-digit code" });
  const { channel, code } = parsed.data;
  try {
    const account = await user.findById(req.userid);
    if (!account) return res.status(404).json({ message: "User not found" });
    if (account.isSuspended) return res.status(403).json({ message: "Account suspended" });
    const target = channel === "email" ? account.email : account.phone;
    if (!target) return res.status(400).json({ message: `Add a registered ${channel} first` });

    const filter = {
      userId: req.userid, channel, target, purpose: "verify-contact",
      usedAt: null, expiresAt: { $gt: new Date() }, attempts: { $lt: 5 },
    };
    const codeHash = hashOtp(req.userid, channel, target, code);

    // Check the code and mark it used in one query so it cannot be reused.
    const record = await verification.findOneAndUpdate(
      { ...filter, codeHash },
      { $set: { usedAt: new Date() } },
      { new: true }
    );
    if (!record) {
      await verification.updateOne(filter, { $inc: { attempts: 1 } });
      return res.status(400).json({ message: "Incorrect, expired or already used code. You can try up to 5 times" });
    }

    const contactField = channel === "email" ? "email" : "phone";
    const verifiedField = channel === "email" ? "emailVerified" : "phoneVerified";
    const result = await user.updateOne({ _id: req.userid, [contactField]: target }, { $set: { [verifiedField]: true } });
    if (!result.matchedCount) return res.status(409).json({ message: "Contact changed. Request a new code" });
    res.status(200).json({ message: `${channel} verified successfully` });
  } catch {
    res.status(500).json({ message: "Could not verify code. Request a new code and try again" });
  }
};

