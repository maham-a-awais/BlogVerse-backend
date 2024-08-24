const joi = require("joi");

const createPostSchema = joi
  .object({
    title: joi.string().min(5).required().messages({
      "string.empty": "Please enter a title",
      "any.require": "Title is required.",
    }),
    body: joi.string().min(5).required().messages({
      "string.empty": "Post body cannot be empty",
      "any.require": "Body is required.",
    }),
    minTimeToRead: joi.number().required().messages({
      "number.empty": "Min Time cannot be empty",
      "any.require": "Min Time is required",
    }),
    categoryId: joi.number().required().messages({
      "number.empty": "Category cannot be empty",
      "any.require": "Category is required.",
    }),
    image: joi.required(),
  })
  .options({ abortEarly: false });

const updatePostSchema = joi
  .object({
    title: joi.string().min(5).messages({
      "string.empty": "Please enter a title",
    }),
    body: joi.string().min(5).messages({
      "string.empty": "Please enter your full name",
    }),
    minTimeToRead: joi.number().messages({
      "number.empty": "Min Time cannot be empty",
    }),
    categoryId: joi.number().messages({
      "number.empty": "Category cannot be empty",
    }),
    image: joi.optional(),
  })
  .options({ abortEarly: false });

module.exports = { createPostSchema, updatePostSchema };
