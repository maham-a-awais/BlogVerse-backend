const express = require("express");
const validationMiddleware = require("../middleware/validation");
const router = express.Router();
const { authenticate } = require("../middleware/userAuth");
const {
  createPostSchema,
  updatePostSchema,
} = require("../utils/validations/postValidation");
const {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.get("/", getAllPosts);

//PROTECTED ROUTES
router.delete("/:postId", authenticate, deletePost);
router.get("/my-posts", authenticate, getMyPosts);
router.post(
  "/",
  authenticate,
  validationMiddleware(createPostSchema),
  createPost
);
router.put(
  "/:postId",
  authenticate,
  validationMiddleware(updatePostSchema),
  updatePost
);

module.exports = router;
