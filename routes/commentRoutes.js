const express = require("express");
const validationMiddleware = require("../middleware/validation");
const router = express.Router();
const { authenticate } = require("../middleware/userAuth");
const {
  createCommentSchema,
  updateCommentSchema,
} = require("../utils/validations/commentValidations");
const {
  createComment,
  getAllComments,
  getReplies,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.get("/:postId", getAllComments);
router.get("/:postId/:parentCommentId", getReplies);

//PROTECTED ROUTES
router.delete("/:postId/:id", authenticate, deleteComment);
router.post(
  "/:postId",
  authenticate,
  validationMiddleware(createCommentSchema),
  createComment
);
router.put(
  "/:postId/:id",
  authenticate,
  validationMiddleware(updateCommentSchema),
  updateComment
);

module.exports = router;
