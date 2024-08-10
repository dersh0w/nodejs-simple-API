const mongoose = require("mongoose");
const validator = require("validator").default;
const bcrypt = require("bcrypt");
const toolSchema = require("./Tool");

// TODO: Verificação na data de nascimento
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Field [firstName] is required!"],
      validate: [
        validator.isAlpha,
        "Field [firstName] must only contain letters!",
      ],
    },
    lastName: {
      type: String,
      required: [true, "Field [lastName] is required!"],
      validate: [
        validator.isAlpha,
        "Field [lastName] must only contain letters!",
      ],
    },
    description: {
      type: String,
    },
    birthday: {
      type: String,
    },
    state: {
      type: String,
      maxlength: [35, "Field [state] must have less than 35 characters!"],
    },
    city: {
      type: String,
      maxlength: [35, "Field [city] must have less than 35 characters!"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: `Supported gender values: ["Male", "Female", "Other"].`,
      },
    },
    contactNumber: {
      type: String,
      maxlength: [
        20,
        "Field [contactNumber] must have less than 20 characters!",
      ],
    },
    email: {
      type: String,
      required: [true, "Field [email] is required!"],
      unique: true,
      validate: [validator.isEmail, "Field [email] must be a valid email!"],
    },
    password: {
      type: String,
      required: [true, "Field [password] is required!"],
      minlength: [8, "Field [password] must have at least 8 characters!"],
      maxlength: [32, "Field [password] must have less than 32 characters!"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Field [passwordConfirm] is required!"],
      minlength: [
        8,
        "Field [passwordConfirm] must have at least 8 characters!",
      ],
      maxlength: [
        32,
        "Field [passwordConfirm] must have less than 32 characters!",
      ],
      validate: {
        validator: function (passwordConfirm) {
          return this.password === passwordConfirm;
        },
        message: "Fields [password] and [passwordConfirm] must match!",
      },
      select: false,
    },
    userTools: {
      type: [toolSchema],
    },
  },
  {
    toJSON: { useProjection: true },
    toObject: { useProjection: true },
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
