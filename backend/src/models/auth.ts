import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinDate: { type: Date, default: Date.now() },
  phone: { type: String },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  preferredLanguage: { type: String, default: "en" },
  role: { type: String, default: "user" },
  isSuspended: { type: Boolean, default: false }
})

export default mongoose.model("user", userSchema)
