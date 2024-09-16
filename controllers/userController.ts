import { Response } from "express";
import { sendResponse } from "../utils/helpers/getResponse";
import { JwtPayload } from "jsonwebtoken";
import {
  userLogoutService,
  userByIdService,
  updateUserService,
  deleteUserService,
  changePasswordService,
} from "../services/userService";
import { CustomRequest } from "../middleware/userAuth";

/**
 * Retrieves the user data of the given user id
 * @param req - request object that contains the user id in the payload
 * @param res - response object that is used to send the response
 * @returns a response object with the user data
 */
export const getUserById = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const response = await userByIdService(userId);
  return sendResponse(res, response);
};

/**
 * Updates a user's profile by ID
 * @param req - request object that contains the user id and updated user data in the payload
 * @param res - response object that is used to send the response
 * @returns a response object with the updated user data
 */
export const updateUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const { fullName, avatar } = req.body;
  const response = await updateUserService(userId, fullName, avatar);
  return sendResponse(res, response);
};

/**
 * Deletes a user by ID
 * @param req - request object that contains the user id as a parameter
 * @param res - response object that is used to send the response
 * @returns a response object with the deleted user data
 */
export const deleteUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const response = await deleteUserService(userId);
  return sendResponse(res, response);
};

/**
 * Logs out a user by ID
 * @param req - request object that contains the user id as a parameter
 * @param res - response object that is used to send the response
 * @returns a response object with a HTTP status code and a JSON body
 */
export const userLogout = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const response = await userLogoutService(userId);
  return sendResponse(res, response);
};

/**
 * Changes the password of a user by ID
 * @param req - request object that contains the user id and the old and new passwords in the body
 * @param res - response object that is used to send the response
 * @returns a response object with a HTTP status code and a JSON body
 */
export const changePassword = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const { oldPassword, newPassword } = req.body;
  const response = await changePasswordService(userId, oldPassword, newPassword);
  return sendResponse(res, response);
};
