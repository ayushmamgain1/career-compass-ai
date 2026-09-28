import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";

// Protect routes - verifies JWT and attaches user to req
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) throw new ApiError(401, "Not authorized, user not found");

      return next();
    } catch (error) {
      throw new ApiError(401, "Not authorized, token invalid or expired");
    }
  }

  if (!token) throw new ApiError(401, "Not authorized, no token provided");
});

export { protect };