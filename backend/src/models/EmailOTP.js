import mongoose from "mongoose";

const emailOTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastSentAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

emailOTPSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const EmailOTP = mongoose.model(
  "EmailOTP",
  emailOTPSchema
);