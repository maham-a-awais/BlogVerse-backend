import joi from "joi";
import { USER_VALIDATION, VALIDATION_KEYS } from "../constants";

const { EMAIL_FORMAT_KEY, EMPTY_STRING_KEY, PASSWORD_PATTERN_KEY, REQUIRE_KEY } = VALIDATION_KEYS;

export const userSignupSchema = joi
  .object({
    fullName: joi
      .string()
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_NAME,
        [REQUIRE_KEY]: USER_VALIDATION.REQUIRED_NAME,
      }),
    email: joi
      .string()
      .email()
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_EMAIL,
        [REQUIRE_KEY]: USER_VALIDATION.REQUIRED_EMAIL,
        [EMAIL_FORMAT_KEY]: USER_VALIDATION.INVALID_EMAIL,
      }),
    password: joi
      .string()
      .pattern(new RegExp(USER_VALIDATION.PASSWORD_REGEXP))
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_PASSWORD,
        [PASSWORD_PATTERN_KEY]: USER_VALIDATION.PASSWORD_PATTERN,
      }),
  })
  .options({ abortEarly: false });

export const userLoginSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_EMAIL,
        [REQUIRE_KEY]: USER_VALIDATION.REQUIRED_EMAIL,
        [EMAIL_FORMAT_KEY]: USER_VALIDATION.INVALID_EMAIL,
      })
      .options({ abortEarly: false }),
    password: joi
      .string()
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_PASSWORD,
      }),
    remember: joi.boolean().optional(),
  })
  .options({ abortEarly: false });

export const forgotPasswordSchema = joi
  .object({
    email: joi
      .string()
      .email()
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_EMAIL,
        [REQUIRE_KEY]: USER_VALIDATION.REQUIRED_EMAIL,
        [EMAIL_FORMAT_KEY]: USER_VALIDATION.INVALID_EMAIL,
      }),
  })
  .options({ abortEarly: false });

export const resetPasswordSchema = joi
  .object({
    password: joi
      .string()
      .pattern(new RegExp(USER_VALIDATION.PASSWORD_REGEXP))
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_PASSWORD,
        [PASSWORD_PATTERN_KEY]: USER_VALIDATION.PASSWORD_PATTERN,
      }),
  })
  .options({ abortEarly: false });

export const updateUserSchema = joi
  .object({
    avatar: joi.optional(),
    fullName: joi.string().optional(),
  })
  .options({ abortEarly: false });

export const changePasswordSchema = joi
  .object({
    oldPassword: joi
      .string()
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_OLD_PASSWORD,
        [REQUIRE_KEY]: USER_VALIDATION.REQUIRED_OLD_PASSWORD,
      }),
    newPassword: joi
      .string()
      .pattern(new RegExp(USER_VALIDATION.PASSWORD_REGEXP))
      .required()
      .messages({
        [EMPTY_STRING_KEY]: USER_VALIDATION.EMPTY_PASSWORD,
        [PASSWORD_PATTERN_KEY]: USER_VALIDATION.PASSWORD_PATTERN,
      }),
  })
  .options({ abortEarly: false });
