const {
  userSignUpService,
  verifyEmailService,
  userLoginService,
  userForgotPassword,
  resetPasswordService,
  allUsersService,
  userByIdService,
  updateUserService,
  deleteUserService,
  userLogoutService,
  refreshTokenService,
  changePasswordService,
} = require("../services/userServices");
const { cookieOptions } = require("../config");
const { sendResponse } = require("../utils/helpers/getResponse");

const signUp = async (req, res) => {
  const { email, fullName, password } = req.body;
  const response = await userSignUpService(fullName, email, password);
  return res
    .status(response.statusCode)
    .cookie("accessToken", response.accessToken, cookieOptions)
    .cookie("refreshToken", response.refreshToken, cookieOptions)
    .json(response);
};

const verifyEmail = async (req, res) => {
  const { id, token } = req.params;
  const response = await verifyEmailService(token, id);
  return sendResponse(res, response);
  // return res.status(response.statusCode).json(response);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const response = await userLoginService(email, password);
  return res
    .status(response.statusCode)
    .cookie("accessToken", response.accessToken, cookieOptions)
    .cookie("refreshToken", response.refreshToken, cookieOptions)
    .json(response);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const response = await userForgotPassword(email);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const response = await resetPasswordService(id, token, password);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

getAllUsers = async (req, res) => {
  const response = await allUsersService();
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

getUserById = async (req, res) => {
  const userId = req.user.id;
  const response = await userByIdService(userId);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

updateUser = async (req, res) => {
  const userId = req.user.id;
  const { fullName, avatar } = req.body;
  const response = await updateUserService(userId, email, fullName, avatar);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

deleteUser = async (req, res) => {
  const userId = req.user.id;
  const response = await deleteUserService(userId);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

userLogout = async (req, res) => {
  const userId = req.user.id;
  const response = await userLogoutService(userId);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const response = await refreshTokenService(refreshToken);
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  const response = await changePasswordService(
    userId,
    oldPassword,
    newPassword
  );
  // return res.status(response.statusCode).json(response);
  return sendResponse(res, response);
};

module.exports = {
  signUp,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  userLogout,
  refreshToken,
  changePassword,
};
