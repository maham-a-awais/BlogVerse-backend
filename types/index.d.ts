// interface Config {
//   PORT: string | undefined;
//   BASE_URL: string | undefined;
//   FRONTEND_BASE_URL: string | undefined;
//   USERNAME: string | undefined;
//   PASSWORD: string | undefined;
//   HOST: string | undefined;
//   DATABASE: string | undefined;
//   DIALECT: string | undefined;
//   EMAIL: string | undefined;
//   EMAIL_PASSWORD: string | undefined;
//   SECRET_KEY: Secret;
//   JWT_EXPIRATION: string | undefined;
//   JWT_REMEMBER_EXPIRATION: string | undefined;
//   PASSWORD_RESET_EXPIRATION: string | undefined;
//   JWT_REFRESH_EXPIRATION: string | undefined;
//   DB_URL: string | undefined;
//   CUSTOM_CSS_URL: string | undefined;
//   CLOUDINARY_CLOUD_NAME: string | undefined;
//   CLOUDINARY_API_KEY: string | undefined;
//   CLOUDINARY_API_SECRET: string | undefined;
//   CLOUDINARY_UPLOAD_PRESET: string | undefined;
//   cookieOptions: {
//     httpOnly: boolean;
//     secure: boolean;
//     sameSite: "strict" | "lax" | "none";
//   };
// }

interface CustomResponse {
  statusCode: number;
  message: string;
  response: string;
  data?: object;
}

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}
