import { logger } from "../logger";
import { getResponse } from "../utils/helpers/getResponse";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { User } from "../models/user";
import { post } from "../models/post";
import { Comment } from "../models/comment";
import { CustomResponse } from "../types";
import { CommentRequestQuery } from "../types";

/**
 * Creates a new comment for a given post and user
 * @param userId - id of the user creating the comment
 * @param postId - id of the post for which the comment is being created
 * @param body - the text of the comment
 * @param parentCommentId - the id of the parent comment if this is a reply. If not provided, this comment is not a reply.
 * @returns a response object with the comment data if successful, otherwise an error response
 */
export const createCommentService = async (
  userId: number,
  postId: number,
  body: string,
  parentCommentId: number
): Promise<CustomResponse> => {
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
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.COMMENT.CREATION_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Retrieves all comments for a given post
 * @param postId - id of the post
 * @param { limit, offset } - pagination parameters
 * @returns a response object with the list of comments
 */
export const getAllCommentService = async (
  postId: number,
  { limit, offset }: CommentRequestQuery
) => {
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
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.COMMENT.RETRIEVAL_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Retrieves all replies of a given comment
 * @param postId - id of the post
 * @param parentCommentId - id of the parent comment
 * @param { limit, offset } - pagination parameters
 * @returns a response object with the list of replies and pagination information
 */
export const getAllRepliesService = async (
  postId: number,
  parentCommentId: number,
  { limit, offset }: CommentRequestQuery
): Promise<CustomResponse> => {
  try {
    const replies = await Comment.findAndCountAll({
      where: { postId, parentCommentId },
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
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.COMMENT.REPLIES_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Updates a comment by ID
 * @param userId - id of the user creating the comment
 * @param postId - id of the post for which the comment is being created
 * @param id - id of the comment to be updated
 * @param body - the text of the comment
 * @returns a response object with the updated comment data if successful, otherwise an error response
 */
export const updateCommentService = async (
  userId: number,
  postId: number,
  id: number,
  body: string
): Promise<CustomResponse> => {
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
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.COMMENT.UPDATE_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Deletes a comment by ID
 * @param userId - id of the user creating the comment
 * @param postId - id of the post for which the comment is being created
 * @param id - id of the comment to be deleted
 * @returns a response object with the deleted comment data if successful, otherwise an error response
 */
export const deleteCommentService = async (
  userId: number,
  postId: number,
  id: number
): Promise<CustomResponse> => {
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
    error instanceof Error && logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.COMMENT.DELETION_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};
