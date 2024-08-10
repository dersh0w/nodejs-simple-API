const { promisify } = require("util");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

const handleUserCreationError = (res, error) => {
  // Cast Error
  if (error.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${error.path}: ${error.value}.`,
    });
  }
  // Validation Error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((el) => el.message);

    return res.status(400).json({
      status: "fail",
      message: `Invalid input data. ${errors.join(". ")}`,
    });
  }
  // Duplicate field
  if (error.code === 11000) {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    return res.status(400).json({
      status: "fail",
      message: `Duplicate field value: ${value}. Please use another value!`,
    });
  }

  // Generic Error
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};

exports.registerUser = async (req, res, next) => {
  const userData = req.body;

  try {
    const user = await User.create(userData);
    createSendToken(res, 201, user);
  } catch (error) {
    return handleUserCreationError(res, error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Verifica se foi passado email e password
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Email and password required!",
    });
  }

  // Verifica se o user existe e se a senha passada está correta
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "fail",
      message: "Incorrect credentials!",
    });
  }

  user.password = undefined;
  createSendToken(res, 200, user);
};

// TODO: Handle invalid JWT
exports.protectRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "JWT Not Found",
    });
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "User not found!",
    });
  }

  req.user = user;
  next();
};