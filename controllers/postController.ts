import { sendResponse } from "../utils/helpers/getResponse";
import {
  createPostService,
  getAllPostService,
  getMyPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/postServices";
import { CustomRequest } from "../middleware/userAuth";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { PostRequestQuery } from "../types";
import { logger } from "../logger";

/**
 * Creates a new post for the given user
 * @param req - request object that contains the user id and post data
 * @param res - response object that is used to send the response
 * @returns a response object with the created post data
 */
export const createPost = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const response = await createPostService(userId, req.body);
  return sendResponse(res, response);
};

/**
 * Updates a post by ID
 * @param req - request object that contains the user id, post id and updated post data as parameters and body
 * @param res - response object that is used to send the response
 * @returns a response object with the updated post data
 */
export const updatePost = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { postId } = req.params;
  const { id: userId } = req.user as JwtPayload;
  const response = await updatePostService(userId, parseInt(postId), req.body);
  return sendResponse(res, response);
};

/**
 * Deletes a post by ID
 * @param req - request object that contains the user id and post id as parameters
 * @param res - response object that is used to send the response
 * @returns a response object with the deleted post data
 */
export const deletePost = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { postId } = req.params;
  const { id: userId } = req.user as JwtPayload;
  const response = await deletePostService(userId, parseInt(postId));
  return sendResponse(res, response);
};

/**
 * Retrieves all posts of the given user
 * @param req - request object that contains the user id and query parameters
 * @param res - response object that is used to send the response
 * @returns a response object with the list of posts
 */
export const getMyPosts = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { id: userId } = req.user as JwtPayload;
  const response = await getMyPostService(userId, convertPostQuery(req));
  return res.status(response.statusCode).json(response);
};

/**
 * Retrieves all posts
 * @param req - request object that contains the query parameters
 * @param res - response object that is used to send the response
 * @returns a response object with the list of posts
 */
export const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
  const response = await getAllPostService(convertPostQuery(req));
  return res.status(response.statusCode).json(response);
};

/**
 * Retrieves a post by ID
 * @param req - request object that contains the post id as a parameter
 * @param res - response object that is used to send the response
 * @returns a response object with the post data
 */
export const getPostById = async (req: Request, res: Response): Promise<Response> => {
  const { postId } = req.params;
  const response = await getPostByIdService(parseInt(postId));
  return res.status(response.statusCode).json(response);
};

/**
 * Converts the query parameters of a request into a PostRequestQuery object.
 * @param req - the request object
 * @returns a PostRequestQuery object containing the title, categoryId, limit and offset
 */
const convertPostQuery = (req: CustomRequest): PostRequestQuery => {
  return {
    title: req.query.title as string,
    categoryId: parseInt(req.query.categoryId as string),
    limit: parseInt(req.query.limit as string),
    offset: parseInt(req.query.offset as string),
  };
};
