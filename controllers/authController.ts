import { sendResponse } from "../utils/helpers/getResponse";
import {
  userSignUpService,
  verifyEmailService,
  userLoginService,
  userForgotPassword,
  resetPasswordService,
  refreshTokenService,
} from "../services/authServices";
import { Request, Response } from "express";

/**
 * Creates a new user and sends a verification email
 * @param req.body - The request body must contain `email`, `fullName`, and `password`
 * @param res - The response object
 * @returns A response object with a HTTP status code and a JSON body
 */
export const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { email, fullName, password } = req.body;
  const response = await userSignUpService(fullName, email, password);
  return sendResponse(res, response);
};

/**
 * Verify a user's email
 * @param req.params - The request params must contain `id` and `token`
 * @param res - The response object
 * @returns A response object with a HTTP status code and a JSON body
 */
export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  const { id, token } = req.params;
  const response = await verifyEmailService(token, parseInt(id));
  return sendResponse(res, response);
};

/**
 * Log in a user
 * @param req.body - The request body must contain `email`, `password`, and `remember`
 * @param res - The response object
 * @returns A response object with a HTTP status code and a JSON body
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password, remember } = req.body;
  const response = await userLoginService(email, password, remember);
  return res.status(response.statusCode).json(response);
};

/**
 * Send a password reset email to the user
 * @param req.body - The request body must contain `email`
 * @param res - The response object
 * @returns A response object with a HTTP status code and a JSON body
 */
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  const response = await userForgotPassword(email);
  return sendResponse(res, response);
};

/**
 * Reset a user's password
 * @param req.params - The request params must contain `id` and `token`
 * @param req.body - The request body must contain `password`
 * @param res - The response object
 * @returns A response object with a HTTP status code and a JSON body
 */
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { id, token } = req.params;
  const { password } = req.body;
  const response = await resetPasswordService(parseInt(id), token, password);
  return sendResponse(res, response);
};

/**
 * Verify the refresh token and return a new access token
 * @param req.body - The request body must contain `refreshToken`
 * @param res - The response object
 * @returns A response object with a HTTP status code and a JSON body
 */
export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const refreshToken = req.body.refreshToken;
  const response = await refreshTokenService(refreshToken);
  return sendResponse(res, response);
};
