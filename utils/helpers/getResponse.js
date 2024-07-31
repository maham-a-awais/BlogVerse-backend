const jwt = require("jsonwebtoken");
const { SECRET_KEY, JWT_EXPIRATION } = require("../../config/localEnv");

const getResponse = (statusCode, message, response, data) => {
  const result = {
    statusCode,
    message,
    response,
  };
  if (data) result.data = data;
  return result;
};

const addTokenToResponse = (response, user) => {
  const token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: JWT_EXPIRATION,
  });
  response.token = token;
  return response;
};

module.exports = { getResponse, addTokenToResponse };
