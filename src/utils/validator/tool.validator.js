const Joi = require("joi");

exports.createToolSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": `Field [title] should be a string`,
    "string.empty": `Field [title] cannot be an empty field`,
    "any.required": `Field [title] is a required field`,
  }),
  link: Joi.string().required().messages({
    "string.base": `Field [link] should be a string`,
    "string.empty": `Field [link] cannot be an empty field`,
    "any.required": `Field [link] is a required field`,
  }),
  description: Joi.string().messages({
    "string.base": `Field [description] should be a string`,
    "string.empty": `Field [description] cannot be an empty field`,
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "array.base": `Field [tags] should be an array`,
    "array.includes": `Field [tags] should be an array of strings`,
  }),
});

exports.updateToolSchema = Joi.object({
  title: Joi.string().messages({
    "string.base": `Field [title] should be a string`,
    "string.empty": `Field [title] cannot be an empty field`,
  }),
  link: Joi.string().messages({
    "string.base": `Field [link] should be a string`,
    "string.empty": `Field [link] cannot be an empty field`,
  }),
  description: Joi.string().messages({
    "string.base": `Field [description] should be a string`,
    "string.empty": `Field [description] cannot be an empty field`,
  }),
  tags: Joi.array().items(Joi.string()).messages({
    "array.base": `Field [tags] should be an array`,
    "array.includes": `Field [tags] should be an array of strings`,
  }),
});
