const logger = require("../logger");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { getResponse } = require("../utils/helpers/getResponse");
const { User, post, Comment } = require("../models/index");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../utils/constants/constants");

const createCommentService = async (userId, postId, body, parentCommentId) => {
  try {
    const findPost = await post.findByPk(postId);

    if (!findPost)
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.POST.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    let findComment;
    if (parentCommentId) {
      findComment = await Comment.findOne({
        where: { id: parentCommentId, postId },
      });

      if (findComment) {
        const newComment = await Comment.create({
          userId,
          postId,
          body,
          parentCommentId,
        });

        if (newComment)
          return getResponse(
            StatusCodes.CREATED,
            SUCCESS_MESSAGES.COMMENT.CREATED,
            ReasonPhrases.CREATED,
            newComment
          );
      } else {
        return getResponse(
          StatusCodes.NOT_FOUND,
          ERROR_MESSAGES.COMMENT.PARENT_NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }
    } else {
      const newComment = await Comment.create({
        userId,
        postId,
        body,
      });

      if (newComment)
        return getResponse(
          StatusCodes.CREATED,
          SUCCESS_MESSAGES.COMMENT.CREATED,
          ReasonPhrases.CREATED,
          newComment
        );
    }
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.COMMENT.CREATION_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.COMMENT.CREATION_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllCommentService = async (postId, { limit, offset }) => {
  try {
    const comments = await Comment.findAndCountAll({
      where: { postId, parentCommentId: null },
      include: [
        {
          model: User,
          attributes: ["fullName", "avatarUrl", "avatarId", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalCommentPage = Math.ceil(comments.count / limit);
    const currentCommentPage = Math.floor(offset / limit) + 1;
    const totalCount = comments.count;

    if (comments.rows && comments.rows.length > 0)
      return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.COMMENT.RETRIEVED, ReasonPhrases.OK, {
        comments: comments.rows,
        totalCount,
        currentCommentPage,
        totalCommentPage,
      });

    return getResponse(
      StatusCodes.NOT_FOUND,
      ERROR_MESSAGES.COMMENT.NO_COMMENT_FOR_POST,
      ReasonPhrases.NOT_FOUND
    );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.COMMENT.RETRIEVAL_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllRepliesService = async (postId, parentCommentId, { limit, offset }) => {
  try {
    const replies = await Comment.findAndCountAll({
      where: { postId, parentCommentId },
      include: [
        {
          model: User,
          attributes: ["fullName", "avatarUrl", "avatarId", "email"],
        },
      ],
      order: [["createdAt"]],
      limit,
      offset,
    });

    const totalRepliesPage = Math.ceil(replies.count / limit);
    const currentRepliesPage = Math.floor(offset / limit) + 1;
    const totalCount = replies.count;

    if (replies.rows)
      return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.COMMENT.REPLIES, ReasonPhrases.OK, {
        replies: replies.rows,
        totalCount,
        currentRepliesPage,
        totalRepliesPage,
      });

    return getResponse(
      StatusCodes.NOT_FOUND,
      ERROR_MESSAGES.COMMENT.REPLIES_NOT_FOUND,
      ReasonPhrases.NOT_FOUND
    );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.COMMENT.REPLIES_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const updateCommentService = async (userId, postId, id, body) => {
  try {
    const comment = await Comment.findOne({ where: { id, userId } });

    if (!comment)
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.COMMENT.NOT_FOUND,
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
        StatusCodes.OK,
        SUCCESS_MESSAGES.COMMENT.UPDATED,
        ReasonPhrases.OK,
        updatedComment
      );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.COMMENT.UPDATED_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteCommentService = async (userId, postId, id) => {
  try {
    const comment = await Comment.findOne({ where: { id, userId, postId } });

    if (!comment)
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.COMMENT.NO_COMMENT_FOR_POST,
        ReasonPhrases.NOT_FOUND
      );

    await Comment.destroy({
      where: { userId, postId, id },
    });

    return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.COMMENT.DELETED, ReasonPhrases.OK);
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.COMMENT.DELETED_FAILED,
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
