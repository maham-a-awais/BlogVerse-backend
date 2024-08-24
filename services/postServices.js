const sequelize = require("sequelize");
const Op = sequelize.Op;
const logger = require("../logger/logger");
const { User, post, category } = require("../models/index");
const { getResponse } = require("../utils/helpers/getResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../utils/constants/constants");

const createPostService = async (
  userId,
  title,
  body,
  minTimeToRead,
  categoryId,
  image
) => {
  try {
    const user = await User.findByPk(userId);

    if (user) {
      const categoryExists = await category.findOne({
        where: {
          id: categoryId,
        },
      });

      if (categoryExists) {
        const newPost = await post.create({
          userId: userId,
          categoryId,
          title,
          body,
          minTimeToRead,
          image,
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
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.CREATION_FAILED,
      ReasonPhrases.NOT_FOUND
    );
  }
};

const updatePostService = async (
  userId,
  postId,
  title,
  body,
  minTimeToRead,
  categoryId,
  image
) => {
  try {
    const user = await User.findByPk(userId);

    if (user) {
      const updatePost = post.update(
        {
          title,
          body,
          minTimeToRead,
          categoryId,
          image,
        },
        { where: { id: postId } }
      );

      if (updatePost)
        return getResponse(
          StatusCodes.OK,
          SUCCESS_MESSAGES.POST.UPDATED,
          ReasonPhrases.OK
        );
      else
        return getResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          ERROR_MESSAGES.POST.UPDATE_FAILED,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        );
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.UPDATE_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const deletePostService = async (userId, postId) => {
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
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.POST.DELETED,
        ReasonPhrases.OK
      );
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.DELETION_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const calculatePagination = (count, limit, offset) => {
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  return { totalPages, currentPage };
};

const getPosts = async (findItems, limit, offset, userId = null) => {
  try {
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

    const pagination = calculatePagination(posts.count, limit, offset);
    if (posts.rows) {
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.POST.RETRIEVED,
        ReasonPhrases.OK,
        {
          posts: posts.rows,
          ...pagination,
        }
      );
    } else
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.POST.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.RETRIEVAL_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getMyPostService = async (
  userId,
  { title, categoryId, offset, limit }
) => {
  const findItems = {
    ...(title && { title: { [Op.iLike]: `%${title}%` } }),
    ...(categoryId && { categoryId }),
  };
  return getPosts(findItems, limit, offset, userId);
};

const getAllPostService = async ({ title, categoryId, offset, limit }) => {
  const findItems = {
    ...(title && { title: { [Op.iLike]: `%${title}%` } }),
    ...(categoryId && { categoryId }),
  };
  return getPosts(findItems, limit, offset);
};

const getPostByIdService = async ({ postId }) => {
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
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.RETRIEVAL_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  createPostService,
  getAllPostService,
  getMyPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
};
