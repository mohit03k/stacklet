import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userid: string;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const match = header?.match(/^Bearer (\S+)$/i);
  const token = match?.[1];
  if (!token) return res.status(401).json({ message: "Please log in" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "Authentication is not configured" });

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (typeof decoded === "string" || typeof decoded.id !== "string" || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ message: "Invalid login token" });
    }
    req.userid = decoded.id;
  } catch {
    return res.status(401).json({ message: "Your session expired or is invalid. Please log in again." });
  }
  next();
};

export default auth;
