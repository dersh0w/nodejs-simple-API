const Joi = require("joi").extend(require("@joi/date"));

exports.registerUserSchema = Joi.object({
  firstName: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]+$/)
    .min(2)
    .max(35)
    .required()
    .messages({
      "string.base": `Field [firstName] should be a string`,
      "string.empty": `Field [firstName] cannot be an empty field`,
      "string.min": `Field [firstName] should have a minimum length of 2 characters`,
      "string.max": `Field [firstName] should have a maximum length of 35 characters`,
      "any.required": `Field [firstName] is a required field`,
    }),
  lastName: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]+$/)
    .min(2)
    .max(35)
    .required()
    .messages({
      "string.base": `Field [lastName] should be a string`,
      "string.empty": `Field [lastName] cannot be an empty field`,
      "string.min": `Field [lastName] should have a minimum length of 2 characters`,
      "string.max": `Field [lastName] should have a maximum length of 35 characters`,
      "any.required": `Field [lastName] is a required field`,
    }),
  description: Joi.string(),
  birthday: Joi.date().format("DD/MM/YYYY").raw().messages({
    "date.base": `Field [birthday] should be a date`,
    "date.format": `Field [birthday] should be in DD/MM/YYYY format`,
  }),
  state: Joi.string().min(2).max(35).messages({
    "string.base": `Field [state] should be a string`,
    "string.empty": `Field [state] cannot be an empty field`,
    "string.min": `Field [state] should have a minimum length of 2 characters`,
    "string.max": `Field [state] should have a maximum length of 35 characters`,
  }),
  city: Joi.string().min(2).max(35).messages({
    "string.base": `Field [city] should be a string`,
    "string.empty": `Field [city] cannot be an empty field`,
    "string.min": `Field [city] should have a minimum length of 2 characters`,
    "string.max": `Field [city] should have a maximum length of 35 characters`,
  }),
  gender: Joi.string().alphanum().valid("Male", "Female", "Other").messages({
    "string.base": `Field [gender] should be a string`,
    "string.empty": `Field [gender] cannot be an empty field`,
    "any.only": `Field [gender] can be "Male", "Female" or "Other"`,
  }),
  contactNumber: Joi.string().max(20).messages({
    "string.base": `Field [contactNumber] should be a string`,
    "string.empty": `Field [contactNumber] cannot be an empty field`,
    "string.max": `Field [contactNumber] should have a maximum length of 20 characters`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `Field [email] should be a string`,
    "string.empty": `Field [email] cannot be an empty field`,
    "string.email": `Field [email] should be a valid email`,
    "any.required": `Field [email] is a required field`,
  }),
  password: Joi.string().required().messages({
    "string.base": `Field [password] should be a string`,
    "string.empty": `Field [password] cannot be an empty field`,
    "any.required": `Field [password] is a required field`,
  }),
  passwordConfirm: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.base": `Field [passwordConfirm] should be a string`,
    "string.empty": `Field [passwordConfirm] cannot be an empty field`,
    "any.only": `Fields [password] and [passwordConfirm] must match`,
    "any.required": `Field [passwordConfirm] is a required field`,
  }),
}).with("password", "passwordConfirm");

exports.loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `Field [email] should be a string`,
    "string.empty": `Field [email] cannot be an empty field`,
    "string.email": `Field [email] should be a valid email`,
    "any.required": `Field [email] is a required field`,
  }),
  password: Joi.string().required().messages({
    "string.base": `Field [password] should be a string`,
    "string.empty": `Field [password] cannot be an empty field`,
    "any.required": `Field [password] is a required field`,
  }),
});
