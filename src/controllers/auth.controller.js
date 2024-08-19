const { promisify } = require("util");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (res, statusCode, user) => {
  const token = signToken(user.id);

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.registerUser = catchAsync(async (req, res, next) => {
  const userData = req.body;

  const user = await User.create(userData);
  createSendToken(res, 201, user);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Verifica se foi passado email e password
  if (!email || !password) {
    return next(new AppError("Email and password required!", 400));
  }

  // Verifica se o user existe e se a senha passada está correta
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect credentials!", 400));
  }

  user.password = undefined;
  createSendToken(res, 200, user);
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("JWT Not Found", 400));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    return next(new AppError("User Not Found", 401));
  }

  req.user = user;
  next();
});
