const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Tool field [title] is required!"],
  },
  link: {
    type: String,
    required: [true, "Tool field [link] is required!"],
  },
  description: {
    type: String,
  },
  tags: {
    type: [String],
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: undefined,
  },
});

module.exports = toolSchema;
