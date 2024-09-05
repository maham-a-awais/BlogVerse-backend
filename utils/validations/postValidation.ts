import joi from "joi";
import { VALIDATION_KEYS } from "../constants";
import { POST_VALIDATION } from "../constants";

const { EMPTY_STRING_KEY, REQUIRE_KEY, EMPTY_NUMBER } = VALIDATION_KEYS;

export const createPostSchema = joi
  .object({
    title: joi
      .string()
      .min(5)
      .required()
      .messages({
        [EMPTY_STRING_KEY]: POST_VALIDATION.EMPTY_TITLE,
        [REQUIRE_KEY]: POST_VALIDATION.REQUIRED_TITLE,
      }),
    body: joi
      .string()
      .min(5)
      .required()
      .messages({
        [EMPTY_STRING_KEY]: POST_VALIDATION.EMPTY_BODY,
        [REQUIRE_KEY]: POST_VALIDATION.REQUIRED_BODY,
      }),
    minTimeToRead: joi
      .number()
      .required()
      .messages({
        [EMPTY_NUMBER]: POST_VALIDATION.EMPTY_MIN_TIME,
        [REQUIRE_KEY]: POST_VALIDATION.REQUIRED_MIN_TIME,
      }),
    categoryId: joi
      .number()
      .required()
      .messages({
        [EMPTY_NUMBER]: POST_VALIDATION.EMPTY_CATEGORY,
        [REQUIRE_KEY]: POST_VALIDATION,
      }),
    image: joi.required(),
  })
  .options({ abortEarly: false });

export const updatePostSchema = joi
  .object({
    title: joi
      .string()
      .min(5)
      .messages({
        [EMPTY_STRING_KEY]: POST_VALIDATION.EMPTY_TITLE,
      }),
    body: joi
      .string()
      .min(5)
      .messages({
        [EMPTY_STRING_KEY]: POST_VALIDATION.EMPTY_BODY,
      }),
    minTimeToRead: joi.number().messages({
      [EMPTY_NUMBER]: POST_VALIDATION.EMPTY_MIN_TIME,
    }),
    categoryId: joi.number().messages({
      [EMPTY_NUMBER]: POST_VALIDATION.EMPTY_CATEGORY,
    }),
    image: joi.optional(),
  })
  .options({ abortEarly: false });
