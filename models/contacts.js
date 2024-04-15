const mongoose = require("mongoose");
const Joi = require("joi");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: String,
  phone: String,
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema, "contacts");

const nameSchema = Joi.string()
  .min(2)
  .max(50)
  .pattern(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/)
  .required()
  .messages({
    "string.min": "Name must have at least 2 characters",
    "string.max": "Name can have at most 50 characters",
    "string.pattern.base":
      "Name must start with an uppercase letter and contain only letters",
    "any.required": "Name is required",
  });

const emailSchema = Joi.string().email().required().messages({
  "string.email": "Invalid email format",
  "any.required": "Email is required",
});

const phoneSchema = Joi.string().required().messages({
  "any.required": "Phone number is required",
});

const validateContactAdd = (body) => {
  const schema = Joi.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
  });

  return schema.validate(body, { abortEarly: false });
};

const validateContactUpdate = (body) => {
  const schema = Joi.object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
  });

  return schema.validate(body, { abortEarly: false });
};

module.exports = {
  Contact,
  validateContactAdd,
  validateContactUpdate,
};
