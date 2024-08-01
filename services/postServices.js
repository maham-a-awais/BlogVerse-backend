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

const getAllPostService = async () => {
  try {
    const posts = await post.findAll({
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (newest first)
    });
    if (posts) {
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.POST.RETRIEVED,
        ReasonPhrases.OK,
        posts
      );
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.POST.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.RETRIEVAL_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const getMyPostService = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const posts = await post.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.POST.RETRIEVED,
        ReasonPhrases.OK,
        posts
      );
    } else {
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.POST.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.RETRIEVAL_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
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

const searchPostService = async (categoryId, title) => {
  try {
    if (!categoryId && !title)
      return getResponse(
        StatusCodes.BAD_REQUEST,
        ERROR_MESSAGES.POST.SEARCH,
        ReasonPhrases.BAD_REQUEST
      );
    const findItems = {
      ...(title && { title: { [Op.iLike]: `%${title}%` } }),
      ...(categoryId && { categoryId }),
    };

    const posts = await post.findAll({
      where: {
        [Op.or]: findItems,
      },
    });
    if (posts) {
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.POST.RETRIEVED,
        ReasonPhrases.OK,
        posts
      );
    }
    return getResponse(
      StatusCodes.NOT_FOUND,
      ERROR_MESSAGES.POST.NOT_FOUND,
      ReasonPhrases.NOT_FOUND
    );
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.POST.SEARCH_FAILED,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const searchMyPostService = async (userId, categoryId, title) => {
  const getPosts = await searchPostService(categoryId, title);
  if (getPosts.data) {
    const myPosts = getPosts.data.filter((post) => post.userId === userId);
    if (myPosts.length > 0) {
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.POST.RETRIEVED,
        ReasonPhrases.OK,
        myPosts
      );
    } else
      return getResponse(
        StatusCodes.NOT_FOUND,
        ERROR_MESSAGES.POST.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
  } else
    return getResponse(
      StatusCodes.NOT_FOUND,
      ERROR_MESSAGES.POST.NOT_FOUND,
      ReasonPhrases.NOT_FOUND
    );
};

module.exports = {
  createPostService,
  getAllPostService,
  getMyPostService,
  updatePostService,
  deletePostService,
  searchPostService,
  searchMyPostService,
};
