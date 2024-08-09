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

  let user;
  try {
    user = await User.create(userData);
  } catch (error) {
    return handleUserCreationError(res, error);
  }

  createSendToken(res, 201, user);
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
