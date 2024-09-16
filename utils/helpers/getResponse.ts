import { Response } from "express";
import { signToken } from "./jwtHelper";
import { logger } from "../../logger";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES, KEYS } from "../constants";
import { CustomResponse } from "../../types";
import { UserAttributes } from "../../types";

/**
 * @function getResponse
 * @description Helper function to generate a response object with a given status code, message, and response string.
 * The response object will also include any data passed in as the fourth argument.
 * @param {number} statusCode - HTTP status code for the response
 * @param {string} message - The message to be included in the response
 * @param {string} response - The response string to be included in the response
 * @param {object | string} [data] - Optional data to be included in the response
 * @returns {CustomResponse} A response object with the given status code, message, response string, and optional data
 */
export const getResponse = (
  statusCode: number,
  message: string,
  response: string,
  data?: object | string
): CustomResponse => {
  const result: CustomResponse = {
    statusCode,
    message,
    response,
    ...(data && { data }),
  };
  return result;
};

/**
 * Helper function to send a response with the given status code and JSON body.
 * @param {Response} res - The Express.js response object
 * @param {CustomResponse} response - A response object with a status code, message, and response string
 * @returns {Response} The response object after sending the response
 */
export const sendResponse = (res: Response, response: CustomResponse): Response => {
  return res.status(response.statusCode).json(response);
};

/**
 * Adds an access token and a refresh token to the response object.
 * If the remember flag is set to true, the refresh token will not expire.
 * @param {CustomResponse} response - The response object to add the tokens to
 * @param {UserAttributes} user - The user object containing the user's id
 * @param {boolean} [remember] - The flag to set the refresh token to never expire
 * @returns {CustomResponse} The response object with the added tokens
 */
export const addTokenToResponse = (
  response: CustomResponse,
  user: UserAttributes,
  remember?: boolean
): CustomResponse => {
  try {
    response.accessToken = signToken({ id: user.id }, KEYS.ACCESS_TOKEN, remember);
    response.refreshToken = signToken({ id: user.id }, KEYS.REFRESH_TOKEN);
  } catch (error: unknown) {
    if (error instanceof Error) logger.error(error);

    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.TOKEN.SIGN,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
  return response;
};
