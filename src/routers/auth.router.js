const express = require("express");
const { loginUser, registerUser } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

module.exports = authRouter;
