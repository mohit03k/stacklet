import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channel: { type: String, enum: ["email", "phone"], required: true },
  purpose: { type: String, default: "verify-contact" },
  target: { type: String, required: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  usedAt: { type: Date, default: null },
  lastSentAt: { type: Date, required: true },
  day: { type: String, required: true }, // UTC date for the daily send limit
  sendCount: { type: Number, default: 0 },
});

verificationSchema.index({ userId: 1, channel: 1, purpose: 1 }, { unique: true });
// Keep expired records: their counters still enforce resend and daily limits.
export default mongoose.model("verification", verificationSchema);
