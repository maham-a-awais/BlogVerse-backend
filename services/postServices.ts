import { Op } from "sequelize";
import { getResponse } from "../utils/helpers/getResponse";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { User } from "../models/user";
import { post } from "../models/post";
import { category } from "../models/category";
import { cloudinary } from "../cloudinary/cloudinary";
import { logger } from "../logger";
import { CustomResponse } from "../types";
import { PostAttributes } from "../types";
import { PostRequestQuery } from "../types";

/**
 * Creates a new post for the given user
 * @param {number} userId - user's id
 * @param {PostAttributes} postAttributes - post's attributes
 * @returns {Promise<CustomResponse>} - response with the created post or error message
 */
export const createPostService = async (
  userId: number,
  { title, body, minTimeToRead, categoryId, image }: PostAttributes
): Promise<CustomResponse> => {
  try {
    const user = await User.findByPk(userId);

    if (user) {
      const categoryExists = await category.findOne({
        where: {
          id: categoryId,
        },
      });

      if (categoryExists) {
        const uploadedImage = await cloudinary.uploader.upload(image, {
          upload_preset: "unsigned_preset",
        });
        const newPost = await post.create({
          userId,
          categoryId,
          title,
          body,
          minTimeToRead,
          image: uploadedImage.secure_url,
          thumbnail: uploadedImage.public_id,
        });
        return getResponse(
          StatusCodes.CREATED,
          SUCCESS_MESSAGES.POST.CREATED,
          ReasonPhrases.CREATED,
          newPost
        );
      }
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.POST.CREATION_FAILED,
    ReasonPhrases.NOT_FOUND
  );
};

/**
 * Updates a post by ID
 * @param userId - the user ID that makes the request
 * @param postId - the ID of the post to be updated
 * @param postAttributes - the updated post data
 * @returns a response object with the updated post data
 */
export const updatePostService = async (
  userId: number,
  postId: number,
  { title, body, minTimeToRead, categoryId, image }: PostAttributes
): Promise<CustomResponse> => {
  try {
    const user = await User.findByPk(userId);

    if (user) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        upload_preset: "unsigned_preset",
      });
      const updatePost = await post.update(
        {
          title,
          body,
          minTimeToRead,
          categoryId,
          image: uploadedImage.secure_url,
          thumbnail: uploadedImage.public_id,
        },
        { where: { id: postId } }
      );

      if (updatePost)
        return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.POST.UPDATED, ReasonPhrases.OK);
      else throw Error;
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.POST.UPDATE_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Deletes a post by ID
 * @param userId - the user ID that makes the request
 * @param postId - the ID of the post to be deleted
 * @returns a response object with the deleted post data
 */
export const deletePostService = async (
  userId: number,
  postId: number
): Promise<CustomResponse> => {
  try {
    const user = await User.findByPk(userId);

    if (user) {
      const findPost = await post.findByPk(postId);

      if (!findPost)
        return getResponse(
          StatusCodes.NOT_FOUND,
          ERROR_MESSAGES.POST.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );

      await post.destroy({ where: { id: postId } });

      return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.POST.DELETED, ReasonPhrases.OK);
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.POST.DELETION_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Calculates the total number of pages and the current page
 * @param count - the total count of items
 * @param limit - the limit of items per page
 * @param offset - the current offset
 * @returns an object with totalPages and currentPage
 */
export const calculatePagination = (count: number, limit: number, offset: number): object => {
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  return { totalPages, currentPage };
};

/**
 * Retrieves all posts, with the option to filter by the given fields.
 * @param findItems - an object with the fields to filter by
 * @param limit - the number of posts to retrieve
 * @param offset - the offset to start retrieving posts from
 * @param userId - the id of the user that owns the posts
 * @returns a response object with the list of posts and pagination data
 */
export const getPosts = async (
  findItems: object,
  limit: number,
  offset: number,
  userId?: number
): Promise<CustomResponse> => {
  try {
    if (Number.isNaN(userId)) {
      return getResponse(StatusCodes.BAD_REQUEST, "Invalid userId", ReasonPhrases.BAD_REQUEST);
    }

    const posts = await post.findAndCountAll({
      where: {
        ...(userId && { userId }),
        ...(Object.keys(findItems).length > 0 && {
          [Op.or]: findItems,
        }),
      },
      include: [
        {
          model: category,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["fullName", "avatarUrl", "avatarId"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    logger.info(posts);

    const pagination = calculatePagination(posts.count, limit, offset);
    if (posts.rows) {
      return getResponse(StatusCodes.OK, SUCCESS_MESSAGES.POST.RETRIEVED, ReasonPhrases.OK, {
        posts: posts.rows,
        ...pagination,
      });
    } else
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.POST.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
  } catch (error) {
    console.log("error", error);
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.POST.RETRIEVAL_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};

/**
 * Retrieves all posts of the given user, with the option to filter by the given fields.
 * @param userId - the user ID that makes the request
 * @param title - the title of the post
 * @param categoryId - the category id of the post
 * @param offset - the offset to start retrieving posts from
 * @param limit - the number of posts to retrieve
 * @returns a response object with the list of posts and pagination data
 */
export const getMyPostService = async (
  userId: number,
  { title, categoryId, offset, limit }: PostRequestQuery
): Promise<CustomResponse> => {
  const findItems = {
    ...(title && { title: { [Op.iLike]: `%${title}%` } }),
    ...(categoryId && { categoryId }),
  };
  logger.info("userId", userId);
  console.log("userId is ,", userId);
  if (userId) {
    const user = await User.findByPk(userId);
    logger.info(`user is ${user}`);
    console.log("user", user);

    return getPosts(findItems, limit, offset, userId);
  } else {
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "No user found",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Retrieves all posts, with the option to filter by the given fields.
 * @param title - the title of the post
 * @param categoryId - the category id of the post
 * @param offset - the offset to start retrieving posts from
 * @param limit - the number of posts to retrieve
 * @returns a response object with the list of posts and pagination data
 */
export const getAllPostService = async ({
  title,
  categoryId,
  offset,
  limit,
}: PostRequestQuery): Promise<CustomResponse> => {
  const findItems = {
    ...(title && { title: { [Op.iLike]: `%${title}%` } }),
    ...(categoryId && { categoryId }),
  };
  return getPosts(findItems, limit, offset);
};

export const getPostByIdService = async (postId: number): Promise<CustomResponse> => {
  try {
    const fetchPost = await post.findByPk(postId, {
      include: [
        {
          model: category,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["fullName", "avatarUrl", "avatarId"],
        },
      ],
    });

    if (fetchPost)
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.POST.RETRIEVED,
        ReasonPhrases.OK,
        fetchPost
      );
    else
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.POST.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
  return getResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.POST.RETRIEVAL_FAILED,
    ReasonPhrases.INTERNAL_SERVER_ERROR
  );
};
