import bcrypt from "bcryptjs";

import { EmailOTP } from "../models/EmailOTP.js";
import generateOTP from "../utils/generateOTP.js";
import hashOTP from "../utils/hashOTP.js";
import sendEmail from "../utils/sendEmail.js";

import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

import { OAuth2Client } from "google-auth-library";

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new ApiError(400, "Please provide name, email, and password");

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new ApiError(400, "Please provide a valid email");

  if (password.length < 6) throw new ApiError(400, "Password must be at least 6 characters");

  const userExists = await User.findOne({
    email: normalizedEmail
  });

  if (userExists) {
    throw new ApiError(409, "An account with this email already exists. Please login.");
  }

  const existingOTP = await EmailOTP.findOne({
    email: normalizedEmail
  });

  if (existingOTP) {
    const secondsSinceLastSent =
      (Date.now() - existingOTP.lastSentAt.getTime()) / 1000;

    if (secondsSinceLastSent < OTP_RESEND_SECONDS) {
      throw new ApiError(
        429,
        "An OTP was recently sent. Please wait before requesting another."
      );
    }
  }

  const otp = generateOTP();

  const hashedOTP = hashOTP(otp);
  const hashedPassword = await bcrypt.hash(password, 10);

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await EmailOTP.findOneAndUpdate(
    { email: normalizedEmail },
    {
      name: name.trim(),
      password: hashedPassword,
      otp: hashedOTP,
      expiresAt,
      lastSentAt: new Date(),
      attempts: 0
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  try {
    await sendEmail({
      email: normalizedEmail,
      subject: "Verify your email address",
      message: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Hello ${name.trim()},</p>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 8px;">${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
          <p>Please do not share this code with anyone.</p>
        </div>
      `
    });
  } catch (error) {
    await EmailOTP.deleteOne({ email: normalizedEmail });
    throw new ApiError(500, "Failed to send verification email");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { email: normalizedEmail },
      "OTP sent successfully. Please verify your email."
    )
  );
});

const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^\d{6}$/.test(String(otp))) {
    throw new ApiError(400, "Invalid OTP format");
  }

  const pendingRegistration = await EmailOTP.findOne({
    email: normalizedEmail
  });

  if (!pendingRegistration) {
    throw new ApiError(
      404,
      "Registration not found or OTP expired. Please register again."
    );
  }

  if (pendingRegistration.expiresAt <= new Date()) {
    await EmailOTP.deleteOne({ _id: pendingRegistration._id });

    throw new ApiError(
      400,
      "OTP expired. Please request a new OTP."
    );
  }

  if (pendingRegistration.attempts >= MAX_OTP_ATTEMPTS) {
    await EmailOTP.deleteOne({ _id: pendingRegistration._id });

    throw new ApiError(
      429,
      "Maximum OTP attempts exceeded. Please register again."
    );
  }

  const submittedOTPHash = hashOTP(String(otp));

  if (submittedOTPHash !== pendingRegistration.otp) {
    pendingRegistration.attempts += 1;
    await pendingRegistration.save();

    throw new ApiError(
      400,
      `Incorrect OTP. ${MAX_OTP_ATTEMPTS - pendingRegistration.attempts} attempts remaining.`
    );
  }

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    await EmailOTP.deleteOne({
      _id: pendingRegistration._id
    });

    throw new ApiError(
      409,
      "An account with this email already exists."
    );
  }

  const user = new User({
    name: pendingRegistration.name,
    email: normalizedEmail,
    password: pendingRegistration.password,
    authProvider: "local",
    isEmailVerified: true
  });

  user.$locals.passwordAlreadyHashed = true;

  await user.save();

  await EmailOTP.deleteOne({
    _id: pendingRegistration._id
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      },
      "Email verified and account registered successfully"
    )
  );
});

const resendEmailOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const pendingRegistration = await EmailOTP.findOne({
    email: normalizedEmail
  });

  if (!pendingRegistration) {
    throw new ApiError(
      404,
      "No pending registration found. Please register again."
    );
  }

  const secondsSinceLastSent =
    (Date.now() - pendingRegistration.lastSentAt.getTime()) / 1000;

  if (secondsSinceLastSent < OTP_RESEND_SECONDS) {
    const remainingSeconds = Math.ceil(
      OTP_RESEND_SECONDS - secondsSinceLastSent
    );

    throw new ApiError(
      429,
      `Please wait ${remainingSeconds} seconds before requesting another OTP.`
    );
  }

  const otp = generateOTP();

  pendingRegistration.otp = hashOTP(otp);
  pendingRegistration.expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );
  pendingRegistration.lastSentAt = new Date();
  pendingRegistration.attempts = 0;

  await pendingRegistration.save();

  try {
    await sendEmail({
      email: normalizedEmail,
      subject: "Your new verification code",
      message: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Hello ${pendingRegistration.name},</p>
          <p>Your new verification code is:</p>
          <h1 style="letter-spacing: 8px;">${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `
    });
  } catch (error) {
    throw new ApiError(500, "Failed to send verification email");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { email: normalizedEmail },
      "A new OTP has been sent successfully."
    )
  );
});

const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, "Invalid Google authentication token");
  }

  if (!payload) {
    throw new ApiError(401, "Unable to verify Google account");
  }

  const {
    sub: googleId,
    email,
    email_verified,
    name,
    picture,
  } = payload;

  if (!googleId || !email || !email_verified) {
    throw new ApiError(401, "Google email is not verified");
  }

  const normalizedEmail = email.toLowerCase();

  let user = await User.findOne({ googleId });

  let isNewUser = false;

  if (user) {
    // Existing Google user
    // Continue to login
  } else {
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "An account with this email already exists. Please login using your existing method first."
      );
    }

    user = await User.create({
      name,
      email: normalizedEmail,
      googleId,
      profilePicture: picture || "",
      authProvider: "google",
      isEmailVerified: true,
    });

    isNewUser = true;
  }

  const token = generateToken(user._id);

  return res.status(isNewUser ? 201 : 200).json(
    new ApiResponse(
      isNewUser ? 201 : 200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        token,
        isNewUser,
      },
      isNewUser
        ? "Google account registered successfully"
        : "Google login successful"
    )
  );
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      "Please provide email and password"
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.password) {
    throw new ApiError(
      400,
      "This account uses Google login. Please sign in with Google."
    );
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email before logging in."
    );
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        token: generateToken(user._id)
      },
      "Login successful"
    )
  );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {
        user
      },
      "Profile fetched"
    )
  );
  res.json({ success: true, data: user });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  user.name = req.body.name ?? user.name;
  user.careerGoal = req.body.careerGoal ?? user.careerGoal;
  user.currentSkills = req.body.currentSkills ?? user.currentSkills;

  const updatedUser = await user.save();

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        careerGoal: updatedUser.careerGoal,
        currentSkills: updatedUser.currentSkills,
      },
      "Profile Updated"
    )
  );
});

export { registerUser, verifyEmailOTP, resendEmailOTP, googleAuth, loginUser, getUserProfile, updateUserProfile };