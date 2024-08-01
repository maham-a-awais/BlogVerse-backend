const joi = require("joi");

const createCommentSchema = joi
  .object({
    body: joi.string().required().messages({
         "string.empty": "Please enter a comment",
         "any.required":"Comment body is required"
    }),
    parentCommentId: joi.number()
  })
  .options({ abortEarly: false });

const updateCommentSchema = joi
  .object({
     body: joi.string().messages({
        "string.empty": "Please enter a comment",
    }),
  })
  .options({ abortEarly: false });

module.exports = { createCommentSchema, updateCommentSchema };
