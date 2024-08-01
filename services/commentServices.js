const logger = require("../logger/logger");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { getResponse } = require("../utils/helpers/getResponse");
const { post, Comment } = require("../models/index");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../utils/constants/constants");

const createCommentService = async (userId, postId, body, parentCommentId) => {
  try {
    const findPost = await post.findByPk(postId);
    if (!findPost)
      return getResponse(404, "Post not found!", ReasonPhrases.NOT_FOUND);
    const findComment = await Comment.findOne({
      where: { id: parentCommentId, postId },
    });
    if (findComment) {
      const newComment = await Comment.create({
        userId,
        postId,
        body,
        parentCommentId,
      });
    } else {
      return getResponse(
        500,
        ERROR_MESSAGES.COMMENT.PARENT_NOT_FOUND,
        ReasonPhrases.INTERNAL_SERVER_ERROR
      );
    }
    if (newComment)
      return getResponse(
        201,
        "Successful! Comment created.",
        ReasonPhrases.CREATED,
        newComment
      );
    return getResponse(
      500,
      "Comment could not be created!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error creating comment",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllCommentService = async (postId) => {
  try {
    const comments = await Comment.findAll({
      where: { postId, parentCommentId: null },
      order: [["createdAt", "DESC"]],
    });
    if (comments && comments.length > 0)
      return getResponse(200, "Comments found!", ReasonPhrases.OK, comments);
    return getResponse(
      404,
      "No Comments for this Post!",
      ReasonPhrases.NOT_FOUND
    );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error fetching comment",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllRepliesService = async (postId, parentCommentId) => {
  try {
    const replies = await Comment.findAll({
      where: { postId, parentCommentId },
      order: [["createdAt"]],
    });
    if (replies)
      return getResponse(200, "Replies found!", ReasonPhrases.OK, replies);
    return getResponse(404, "Replies not found!", ReasonPhrases.NOT_FOUND);
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error fetching replies",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const updateCommentService = async (userId, postId, id, body) => {
  try {
    const comment = await Comment.findOne({ where: { id, userId } });
    if (!comment)
      return getResponse(
        404,
        "No Comment found for this user!",
        ReasonPhrases.NOT_FOUND
      );
    const updatedComment = await Comment.update(
      { body },
      {
        where: { userId, postId, id },
      }
    );
    if (updatedComment)
      return getResponse(
        200,
        "Comment updated!",
        ReasonPhrases.OK,
        updatedComment
      );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error updating comment",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteCommentService = async (userId, postId, id) => {
  try {
    const comment = await Comment.findOne({ where: { id, userId, postId } });
    if (!comment)
      return getResponse(
        404,
        "No Comment found for this user on this post!",
        ReasonPhrases.NOT_FOUND
      );
    await Comment.destroy({
      where: { userId, postId, id },
    });
    return getResponse(200, "Comment Deleted!", ReasonPhrases.OK);
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error deleting comment",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  createCommentService,
  getAllCommentService,
  getAllRepliesService,
  updateCommentService,
  deleteCommentService,
};
