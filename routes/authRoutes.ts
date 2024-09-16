import { Router } from "express";
import { userExists } from "../middleware/userAuth";
import { validationMiddleware } from "../middleware/validation";
import {
  signUp,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/authController";
import {
  userSignupSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utils/validations/userValidation";

export const authRouter = Router();

//LOGIN USER
authRouter.post("/login", validationMiddleware(userLoginSchema), login);

//REFRESH TOKEN
authRouter.post("/refresh-token", refreshToken);

//VERIFY EMAIL
authRouter.get("/verify-email/:id/:token", verifyEmail);

//SIGN UP USER
authRouter.post("/", validationMiddleware(userSignupSchema), userExists, signUp);

//FORGOT PASSWORD
authRouter.post("/forgot-password", validationMiddleware(forgotPasswordSchema), forgotPassword);

//RESET PASSWORD
authRouter.post(
  "/reset-password/:id/:token",
  validationMiddleware(resetPasswordSchema),
  resetPassword
);
