import { User } from "../models/user";
import { logger } from "../logger";
import { cloudinary } from "../cloudinary/cloudinary";
import { getResponse } from "../utils/helpers/getResponse";
import { hash, compareHash } from "../utils/helpers/bcryptHelper";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { CustomResponse } from "../types";

/**
 * Retrieves a user by ID
 * @param id - The ID of the user
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 * @throws {Error} If the user is not found
 * @throws {Error} If there is an error with the database
 */
export const userByIdService = async (id: number): Promise<CustomResponse> => {
  try {
    const user = await User.findByPk(id);

    if (user) {
      const response = getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.USER.FOUND,
        ReasonPhrases.OK,
        user
      );
      return response;
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
    ERROR_MESSAGES.USER.FETCH_USER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Updates a user's profile by ID
 * @param id - The ID of the user
 * @param fullName - The new full name of the user
 * @param avatar - The new avatar of the user
 * @returns A response object with the updated user data
 * @throws {Error} If the user is not found
 * @throws {Error} If there is an error with the database
 */
export const updateUserService = async (
  id: number,
  fullName: string,
  avatar: string
): Promise<CustomResponse> => {
  try {
    const findUser = await User.findByPk(id);

    if (findUser) {
      let uploadedImage;

      if (avatar)
        uploadedImage = await cloudinary.uploader.upload(avatar, {
          upload_preset: "unsigned_preset",
        });

      console.log(uploadedImage);
      if (uploadedImage) {
        await findUser.update(
          {
            fullName,
            avatarUrl: uploadedImage.secure_url,
            avatarId: uploadedImage.public_id,
          },
          { where: { id } }
        );

        return getResponse(
          StatusCodes.OK,
          SUCCESS_MESSAGES.USER.UPDATED,
          ReasonPhrases.OK,
          uploadedImage.secure_url
        );
      } else {
        await findUser.update(
          {
            fullName,
          },
          { where: { id } }
        );
        return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.USER.UPDATED, ReasonPhrases.OK);
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
    ERROR_MESSAGES.USER.FETCH_USER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Deletes a user by ID
 * @param id - The ID of the user
 * @returns A response object with the deleted user data
 * @throws {Error} If the user is not found
 * @throws {Error} If there is an error with the database
 */
export const deleteUserService = async (id: number): Promise<CustomResponse> => {
  try {
    const user = await User.findByPk(id);

    if (user) {
      await user.destroy();
      return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.USER.DELETED, ReasonPhrases.OK);
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.FETCH_USER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Logs out a user by ID
 * @param id - The ID of the user
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 * @throws {Error} If the user is not found
 * @throws {Error} If there is an error with the database
 */
export const userLogoutService = async (id: number): Promise<CustomResponse> => {
  try {
    const user = await User.findByPk(id);

    if (user) {
      return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.USER.LOG_OUT, ReasonPhrases.OK);
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
    ERROR_MESSAGES.USER.LOG_OUT,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Changes the password of a user by ID
 * @param userId - The ID of the user
 * @param oldPassword - The old password of the user
 * @param newPassword - The new password of the user
 * @returns A response object with a HTTP status code, a JSON message, and a JSON body
 * @throws {Error} If the user is not found
 * @throws {Error} If the old password is incorrect
 * @throws {Error} If there is an error with the database
 */
export const changePasswordService = async (
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<CustomResponse> => {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (user && (await compareHash(oldPassword, user.password))) {
      const newHashedPassword = await hash(newPassword);

      await user.update({ password: newHashedPassword });

      return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.USER.PASSWORD_CHANGED, ReasonPhrases.OK);
    } else {
      return getResponse(
        StatusCodes.UNAUTHORIZED,
        ERROR_MESSAGES.USER.INCORRECT_PASSWORD,
        ReasonPhrases.UNAUTHORIZED
      );
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.USER.CHANGING_PASSWORD,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};
