const Joi = require("joi");

exports.getAllToolsSchema = Joi.object({
  title: Joi.array().items(Joi.string().required()).messages({
    "array.base": `Parameter [title] should be a string separated by commas`,
  }),
  tags: Joi.array().items(Joi.string().required()).messages({
    "array.base": `Parameter [tags] should be a string separated by commas`,
  }),
  fields: Joi.array()
    .items(
      Joi.string()
        .valid(
          "_id",
          "title",
          "link",
          "description",
          "tags",
          "createdAt",
          "updatedAt"
        )
        .required()
    )
    .messages({
      "array.base": `Parameter [fields] should be a string separated by commas`,
      "any.only": `Parameter [fields] can only be: [_id, title, link, description, tags, createdAt, updatedAt]`,
    }),
  limit: Joi.number().integer().min(1).messages({
    "number.base": `Parameter [limit] should be an integer`,
    "number.min": `Parameter [limit] should be greater than or equal to 1`,
  }),
  page: Joi.number().integer().min(1).messages({
    "number.base": `Parameter [page] should be an integer`,
    "number.min": `Parameter [page] should be greater than or equal to 1`,
  }),
});

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
