import { Request, Response } from "express";
import { CustomRequest } from "../middleware/userAuth";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../utils/helpers/getResponse";
import {
  createCommentService,
  getAllCommentService,
  getAllRepliesService,
  updateCommentService,
  deleteCommentService,
} from "../services/commentServices";
import { CommentRequestQuery } from "../types";

/**
 * Creates a new comment for the given post
 * @param req - request object that contains the user id and comment body
 * @param res - response object that is used to send the response
 * @returns a response object with the comment data
 */
export const createComment = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { postId } = req.params;
  const { body, parentCommentId } = req.body;
  const { id: userId } = req.user as JwtPayload;
  const response = await createCommentService(userId, parseInt(postId), body, parentCommentId);
  return sendResponse(res, response);
};

/**
 * Retrieves all comments for a given post
 * @param req - request object that contains the post id as a parameter
 * @param res - response object that is used to send the response
 * @returns a response object with the list of comments
 */
export const getAllComments = async (req: Request, res: Response): Promise<Response> => {
  const postId = req.params.postId;
  const response = await getAllCommentService(parseInt(postId), convertCommentQuery(req));
  return sendResponse(res, response);
};

/**
 * Retrieves all replies of a given comment
 * @param req - request object that contains the post id and parent comment id as parameters
 * @param res - response object that is used to send the response
 * @returns a response object with the list of replies
 */
export const getReplies = async (req: Request, res: Response): Promise<Response> => {
  const { postId, parentCommentId } = req.params;
  const response = await getAllRepliesService(
    parseInt(postId),
    parseInt(parentCommentId),
    convertCommentQuery(req)
  );
  return sendResponse(res, response);
};

/**
 * Updates a comment by ID
 * @param req - request object that contains the user id, post id, comment id and the updated comment body
 * @param res - response object that is used to send the response
 * @returns a response object with the updated comment data
 */
export const updateComment = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const { postId, id } = req.params;
  const { body } = req.body;
  const response = await updateCommentService(userId, parseInt(postId), parseInt(id), body);
  return sendResponse(res, response);
};

/**
 * Deletes a comment by ID
 * @param req - request object that contains the user id, post id and comment id as parameters
 * @param res - response object that is used to send the response
 * @returns a response object with the deleted comment data
 */
export const deleteComment = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const { postId, id } = req.params;
  const response = await deleteCommentService(userId, parseInt(postId), parseInt(id));
  return sendResponse(res, response);
};

/**
 * Converts the query parameters of a request into a CommentRequestQuery object.
 * @param req - the request object
 * @returns a CommentRequestQuery object containing the limit and offset
 */
const convertCommentQuery = (req: Request): CommentRequestQuery => {
  return {
    limit: parseInt(req.query.limit as string),
    offset: parseInt(req.query.offset as string),
  };
};
