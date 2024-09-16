import { Router } from "express";
import { validationMiddleware } from "../middleware/validation";
import { authenticate } from "../middleware/userAuth";
import {
  createComment,
  getAllComments,
  getReplies,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { createCommentSchema, updateCommentSchema } from "../utils/validations/commentValidations";

export const commentRouter = Router();

//GET ALL COMMENTS
commentRouter.get("/:postId", getAllComments);

//GET ALL REPLIES OF A COMMENT
commentRouter.get("/:postId/:parentCommentId", getReplies);

//DELETE A COMMENT
commentRouter.delete("/:postId/:id", authenticate, deleteComment);
commentRouter.post(
  "/:postId",
  authenticate,
  validationMiddleware(createCommentSchema),
  createComment
);

//UPDATE A COMMENT
commentRouter.put(
  "/:postId/:id",
  authenticate,
  validationMiddleware(updateCommentSchema),
  updateComment
);
