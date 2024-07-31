require("dotenv").config();
module.exports = {
  PORT: process.env.PORT,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_NAME,
  EMAIL: process.env.MY_EMAIL,
  EMAIL_PASSWORD: process.env.MY_PASSWORD,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  PASSWORD_RESET_EXPIRATION: process.env.PASSWORD_RESET_EXPIRATION,
};
