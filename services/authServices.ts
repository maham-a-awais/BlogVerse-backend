import { User } from "../models/user";
import { config } from "../config";
import { logger } from "../logger";
import { sendingMail } from "../nodemailer/mailing";
import { hash, compareHash } from "../utils/helpers/bcryptHelper";
import { signToken, verifyToken } from "../utils/helpers/jwtHelper";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { getResponse, addTokenToResponse } from "../utils/helpers/getResponse";
import { ERROR_MESSAGES, KEYS, SUCCESS_MESSAGES } from "../utils/constants";
import { JwtPayload } from "jsonwebtoken";
import { CustomResponse } from "../types";

const { FRONTEND_BASE_URL } = config;

/**
 * Creates a new user and sends a verification email
 * @param fullName - The new user's full name
 * @param email - The new user's email
 * @param password - The new user's password
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 */
export const userSignUpService = async (
  fullName: string,
  email: string,
  password: string
): Promise<CustomResponse> => {
  try {
    const user = await User.create({
      fullName,
      email,
      password: await hash(password),
    });

    if (user) {
      const verifyToken = signToken({ id: user.id }, KEYS.ACCESS_TOKEN);

      if (verifyToken) {
        await sendingMail({
          to: `${email}`,
          subject: "Account Verification Link",
          html: `<h1>Please verify your account</h1><br><p>Hello ${fullName},To verify your account, please click on the link below:</p><br><a href=${FRONTEND_BASE_URL}/verify-email/${user.id}/${verifyToken}>Verification Link</a>`,
        });

        const response = getResponse(
          StatusCodes.CREATED,
          SUCCESS_MESSAGES.USER.CREATED + SUCCESS_MESSAGES.USER.VERIFY_EMAIL,
          ReasonPhrases.CREATED,
          user
        );
        return addTokenToResponse(response, user);
      }
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.USER.SIGN_UP,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Verify a user's email
 * @param token - The verification token sent to the user's email
 * @param id - The user's id
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 */
export const verifyEmailService = async (token: string, id: number): Promise<CustomResponse> => {
  try {
    const getToken = verifyToken(token) as JwtPayload;

    if (!getToken.statusCode) {
      const verifyUser = await User.findOne({
        where: {
          id: getToken.id,
        },
      });

      if (verifyUser) {
        if (verifyUser.isVerified) {
          return getResponse(
            StatusCodes.OK,
            ERROR_MESSAGES.USER.EMAIL_ALREADY_VERIFIED + SUCCESS_MESSAGES.USER.PLEASE_LOG_IN,
            ReasonPhrases.OK,
            verifyUser
          );
        } else {
          const updateUser = await User.update({ isVerified: true }, { where: { id } });
          if (updateUser) {
            return getResponse(
              StatusCodes.OK,
              SUCCESS_MESSAGES.USER.EMAIL_VERIFIED,
              ReasonPhrases.OK
            );
          }
        }
      } else {
        return getResponse(
          StatusCodes.NOT_FOUND,
          ERROR_MESSAGES.USER.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.USER.VERIFY_EMAIL,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Logs in a user and returns an access token and a refresh token.
 * @param email - The user's email address
 * @param password - The user's password
 * @param remember - If true, the refresh token will be set to never expire
 * @throws {Error} If the user is not found or the password is incorrect
 * @throws {Error} If the user's email is not verified
 * @throws {Error} If there is an error with the database
 * @returns A response object with the access token, refresh token, and a JSON body
 */
export const userLoginService = async (
  email: string,
  password: string,
  remember: boolean
): Promise<CustomResponse> => {
  try {
    console.log(email);
    console.log(password);
    const user = await User.findOne({ where: { email } });

    if (user) {
      console.log("user found");
      if (await compareHash(password, user.password)) {
        if (user.isVerified) {
          const response = getResponse(
            StatusCodes.OK,
            SUCCESS_MESSAGES.USER.LOGGED_IN,
            ReasonPhrases.OK
          );
          return addTokenToResponse(response, user, remember);
        } else {
          return getResponse(
            StatusCodes.UNAUTHORIZED,
            ERROR_MESSAGES.USER.EMAIL_NOT_VERIFIED,
            ReasonPhrases.UNAUTHORIZED
          );
        }
      } else {
        return getResponse(
          StatusCodes.UNAUTHORIZED,
          ERROR_MESSAGES.USER.INCORRECT_EMAIL_OR_PASSWORD,
          ReasonPhrases.UNAUTHORIZED
        );
      }
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.USER.LOG_IN,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Sends a password reset email to the user
 * @param email - The user's email address
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 */
export const userForgotPassword = async (email: string): Promise<CustomResponse> => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return getResponse(
        StatusCodes.CONFLICT,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.CONFLICT
      );
    }

    const token = signToken({ id: user.id }, KEYS.PASSWORD_RESET)!;

    await sendingMail({
      to: `${email}`,
      subject: "Password Reset Link",
      html: `<h1>Please reset your password</h1><br><p>Hello ${user.fullName}, please click on the link below:</p><br><a href=${FRONTEND_BASE_URL}/reset-password/${user.id}/${token}>Reset your password</a>`,
    });
    return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.USER.RESET_EMAIL_SENT, ReasonPhrases.OK);
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.USER.EMAIL_NOT_SENT,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Resets a user's password using a reset token
 * @param id - The user's id
 * @param token - The reset token
 * @param password - The new password
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 */
export const resetPasswordService = async (
  id: number,
  token: string,
  password: string
): Promise<CustomResponse> => {
  try {
    const getToken = verifyToken(token) as JwtPayload;

    if (!getToken.statusCode) {
      if (id == getToken.id) {
        const hashPassword = await hash(password);

        await User.update({ password: hashPassword }, { where: { id } });

        return getResponse(
          StatusCodes.OK,
          SUCCESS_MESSAGES.USER.PASSWORD_RESET_SUCCESS + SUCCESS_MESSAGES.USER.PLEASE_LOG_IN,
          ReasonPhrases.OK
        );
      } else {
        return getResponse(
          StatusCodes.UNAUTHORIZED,
          ERROR_MESSAGES.USER.INVALID_TOKEN,
          ReasonPhrases.UNAUTHORIZED
        );
      }
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.USER.PASSWORD_RESET_FAIL,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Generates a new access and refresh token for a valid refresh token
 * @param token - The refresh token
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 */
export const refreshTokenService = async (token: string): Promise<CustomResponse> => {
  try {
    const getToken = verifyToken(token) as JwtPayload;

    if (!getToken.statusCode) {
      const user = await User.findByPk(getToken.id);

      if (user) {
        const response = getResponse(
          StatusCodes.OK,
          SUCCESS_MESSAGES.USER.NEW_TOKEN,
          ReasonPhrases.OK
        );

        return addTokenToResponse(response, user);
      }
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.USER.TOKEN,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};
