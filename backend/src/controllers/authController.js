import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new ApiError(400, "Please provide name, email, and password");

  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(400, "User with this email already exists");

  const user = await User.create({ name, email, password });

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id)},
      "User registered succesfully"
    )
  );
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "Please provide email and password");

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) throw new ApiError(401, "Invalid User Credentials");

  return res
  .status(201)
  .json(
    new ApiResponse(
      201,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      },
      "Login Successfull"
    )
  );
});

// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
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

// @desc    Update user profile (name, careerGoal, currentSkills)
// @route   PUT /api/auth/profile
// @access  Private
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

export { registerUser, loginUser, getUserProfile, updateUserProfile };