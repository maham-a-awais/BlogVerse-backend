import { Router } from "express";
import { userRouter } from "./userRoutes";
import { authRouter } from "./authRoutes";
import { postRouter } from "./postRoutes";
import { commentRouter } from "./commentRoutes";
export const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);
