import dotenv from "dotenv";
// import { Secret } from "jsonwebtoken";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  ENV: process.env.ENV,
  BASE_URL: process.env.BASE_URL,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
  USERNAME: process.env.DB_USERNAME as string,
  PASSWORD: process.env.DB_PASSWORD,
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_NAME as string,
  DIALECT: process.env.DIALECT,
  EMAIL: process.env.MY_EMAIL,
  EMAIL_PASSWORD: process.env.MY_PASSWORD,
  SECRET_KEY: process.env.SECRET_KEY as string,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_REMEMBER_EXPIRATION: process.env.JWT_REMEMBER_EXPIRATION,
  PASSWORD_RESET_EXPIRATION: process.env.PASSWORD_RESET_EXPIRATION,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
  DB_URL: process.env.POSTGRES_URL,
  CUSTOM_CSS_URL: process.env.CSS_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  },
};
