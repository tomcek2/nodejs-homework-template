const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const { emailSchema } = require("../models/contacts");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: String,
});

const User = mongoose.model("User", userSchema, "users");

const validateUser = (user) => {
  const schema = Joi.object({
    email: emailSchema,
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

module.exports = { User, validateUser };
