import joi from "joi";
import { COMMENT_VALIDATION, VALIDATION_KEYS } from "../constants";

const { EMPTY_STRING_KEY, REQUIRE_KEY } = VALIDATION_KEYS;

export const createCommentSchema = joi
  .object({
    body: joi
      .string()
      .required()
      .messages({
        [EMPTY_STRING_KEY]: COMMENT_VALIDATION.EMPTY_COMMENT,
        [REQUIRE_KEY]: COMMENT_VALIDATION.REQUIRED_COMMENT,
      }),
    parentCommentId: joi.number(),
  })
  .options({ abortEarly: false });

export const updateCommentSchema = joi
  .object({
    body: joi.string().messages({
      [EMPTY_STRING_KEY]: COMMENT_VALIDATION.EMPTY_COMMENT,
    }),
  })
  .options({ abortEarly: false });
