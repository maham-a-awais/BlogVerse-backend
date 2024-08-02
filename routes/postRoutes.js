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
  searchPosts,
  searchMyPosts,
} = require("../controllers/postController");

router.get("/", getAllPosts);
router.get("/my-posts", authenticate, getMyPosts);
router.delete("/:postId", authenticate, deletePost);
router.get("/search", searchPosts);
router.get("/search-my-posts", authenticate, searchMyPosts);
router.post(
  "/",
  validationMiddleware(createPostSchema),
  authenticate,
  createPost
);
router.put(
  "/:postId",
  validationMiddleware(updatePostSchema),
  authenticate,
  updatePost
);

module.exports = router;
