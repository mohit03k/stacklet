import type { Request, Response } from "express"
import user from "../models/auth.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

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

