const { signRefreshToken, signAccessToken } = require("./jwtHelper");

const getResponse = (statusCode, message, response, data) => {
  const result = {
    statusCode,
    message,
    response,
  };
  if (data) result.data = data;
  return result;
};

const sendResponse = (res, response) => {
  return res.status(response.statusCode).json(response);
};

const addTokenToResponse = (response, user) => {
  response.accessToken = signAccessToken({ id: user.id });
  response.refreshToken = signRefreshToken({ id: user.id });
  return response;
};

module.exports = { getResponse, sendResponse, addTokenToResponse };
