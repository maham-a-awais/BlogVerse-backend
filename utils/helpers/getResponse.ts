// const { signRefreshToken, signAccessToken } = require("./jwtHelper");
import { Response } from "express";

export const getResponse = (
  statusCode: number,
  message: string,
  response: string,
  data?: object
): CustomResponse => {
  const result: CustomResponse = {
    statusCode,
    message,
    response,
    ...(data && { data }),
  };
  return result;
};

export const sendResponse = (res: Response, response: CustomResponse): Response => {
  return res.status(response.statusCode).json(response);
};

// const addTokenToResponse = (response, user, remember) => {
//   response.accessToken = signAccessToken({ id: user.id }, remember);
//   response.refreshToken = signRefreshToken({ id: user.id });
//   return response;
// };
