import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "both"],
      default: "local",
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    careerGoal: {
      type: String,
      default: "",
    },
    currentSkills: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.path("password").validate(function (value) {
  if (this.authProvider === "google") return !value;
  return Boolean(value);
}, "Password is required");

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  if (this.$locals.passwordAlreadyHashed) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;

  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);