const joi = require("joi");

const userSignupSchema = joi
  .object({
    fullName: joi.string().required().messages({
      "string.empty": "Please enter your full name",
      "any.require": "Full Name is required.",
    }),
    email: joi.string().email().required().messages({
      "string.empty": "Email cannot be empty",
      "any.require": "Email is required.",
      "string.email": "Invalid email format.",
    }),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0–9@]{6,30}$"))
      .required()
      .messages({
        "string.empty": "Password cannot be empty",
        "string.pattern.base":
          'Password must contain only letters, numbers, or "@" and be between 6 and 30 characters long.',
      }),
  })
  .options({ abortEarly: false });

const userLoginSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required()
      .messages({
        "string.empty": "Email cannot be empty",
        "any.require": "Email is required.",
        "string.email": "Invalid email format.",
      })
      .options({ abortEarly: false }),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0–9@]{6,30}$"))
      .required()
      .messages({
        "string.empty": "Password cannot be empty",
        "string.pattern.base":
          'Password must contain only letters, numbers, or "@" and be between 6 and 30 characters long.',
      }),
  })
  .options({ abortEarly: false });

const forgotPasswordSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.empty": "Email cannot be empty",
      "any.require": "Email is required.",
      "string.email": "Invalid email format.",
    }),
  })
  .options({ abortEarly: false });

const resetPasswordSchema = joi
  .object({
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0–9@]{6,30}$"))
      .required()
      .messages({
        "string.empty": "Password cannot be empty",
        "string.pattern.base":
          'Password must contain only letters, numbers, or "@" and be between 6 and 30 characters long.',
      }),
  })
  .options({ abortEarly: false });

const updateUserSchema = joi
  .object({
    avatar: joi.string(),
    fullName: joi.string().messages({
      "string.empty": "Please enter your full name",
      "any.require": "Full Name is required.",
    }),
    email: joi.string().email().messages({
      "string.empty": "Email cannot be empty",
      "any.require": "Email is required.",
      "string.email": "Invalid email format.",
    }),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0–9@]{6,30}$"))
      .messages({
        "string.empty": "Password cannot be empty",
        "string.pattern.base":
          'Password must contain only letters, numbers, or "@" and be between 6 and 30 characters long.',
      }),
  })
  .options({ abortEarly: false });
module.exports = {
  userSignupSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
};
