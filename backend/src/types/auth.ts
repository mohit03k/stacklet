import z from "zod"

export const otpRequestSchema = z.object({
  channel: z.enum(["email", "phone"])
})

export const otpVerifySchema = otpRequestSchema.extend({
  code: z.string().regex(/^\d{6}$/, "Enter the six-digit code"),
});
