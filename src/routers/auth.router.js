const express = require("express");
const { loginUser, registerUser } = require("../controllers/auth.controller");
const {
  loginUserSchema,
  registerUserSchema,
} = require("../utils/validator/user.validator");
const { validateData } = require("../utils/validator/validator");

const authRouter = express.Router();

authRouter.post("/register", validateData(registerUserSchema), registerUser);
authRouter.post("/login", validateData(loginUserSchema), loginUser);

module.exports = authRouter;
