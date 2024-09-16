import { Router } from "express";
import { authenticate } from "../middleware/userAuth";
import { validationMiddleware } from "../middleware/validation";
import { changePasswordSchema, updateUserSchema } from "../utils/validations/userValidation";
import {
  changePassword,
  deleteUser,
  getUserById,
  updateUser,
  userLogout,
} from "../controllers/userController";

export const userRouter = Router();

//GET USER BY ID
userRouter.get("/", authenticate, getUserById);

//DELETE USER
userRouter.delete("/", authenticate, deleteUser);

//UPDATE USER
userRouter.put("/", authenticate, validationMiddleware(updateUserSchema), updateUser);

//CHANGE PASSWORD
userRouter.post("/", authenticate, validationMiddleware(changePasswordSchema), changePassword);

//LOGOUT
userRouter.get("/logout", authenticate, userLogout);
