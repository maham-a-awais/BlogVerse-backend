import { Router } from "express";
import { validationMiddleware } from "../middleware/validation";
import { authenticate } from "../middleware/userAuth";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController";
import { createPostSchema, updatePostSchema } from "../utils/validations/postValidation";

export const postRouter = Router();

//GET ALL POSTS
postRouter.get("/", getAllPosts);

//GET POST BY ID
postRouter.get("/:postId", getPostById);

//DELETE A POST
postRouter.delete("/:postId", authenticate, deletePost);

//UPDATE A POST
postRouter.get("/my-posts", authenticate, getMyPosts);

//CREATE A POST
postRouter.post("/", authenticate, validationMiddleware(createPostSchema), createPost);

//UPDATE A POST
postRouter.put("/:postId", authenticate, validationMiddleware(updatePostSchema), updatePost);
