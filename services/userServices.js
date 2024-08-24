const logger = require("../logger/logger");
const { validate } = require("deep-email-validator");
const { sendingMail } = require("../nodemailer/mailing");
const { User } = require("../models/index");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { hash, compareHash } = require("../utils/helpers/bcryptHelper");
const {
  BASE_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} = require("../config");
const { signAccessToken, verifyToken } = require("../utils/helpers/jwtHelper");
const {
  getResponse,
  addTokenToResponse,
} = require("../utils/helpers/getResponse");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../utils/constants/constants");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");

cloudinary.config({
  api_key: "219276792713361",
  api_secret: "93bjLciNeb9KGJ15qjv-DatXtCs",
  cloud_name: "dg8ai32i5",
});

const userSignUpService = async (fullName, email, password) => {
  try {
    // const validationResult = await validate(email);
    // if (!validationResult.valid) {
    //   return getResponse(
    //     StatusCodes.BAD_REQUEST,
    //     ERROR_MESSAGES.USER.EMAIL_INVALID,
    //     ReasonPhrases.BAD_REQUEST
    //   );
    // }

    const user = await User.create({
      fullName,
      email,
      password: await hash(password),
    });

    if (user) {
      const verifyToken = signAccessToken({ id: user.id });
      if (!verifyToken.statusCode) {
        await sendingMail({
          to: `${email}`,
          subject: "Account Verification Link",
          html: `<h1>Please verify your account</h1><br><p>Hello ${fullName},To verify your account, please click on the link below:</p><br><a href=${BASE_URL}/users/verify-email/${user.id}/${verifyToken}>Verification Link</a>`,
        });
        const response = getResponse(
          StatusCodes.CREATED,
          SUCCESS_MESSAGES.USER.CREATED + SUCCESS_MESSAGES.USER.VERIFY_EMAIL,
          ReasonPhrases.CREATED,
          user
        );
        return addTokenToResponse(response, user);
      } else return verifyToken;
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.SIGN_UP,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const verifyEmailService = async (token, id) => {
  try {
    const getToken = verifyToken(token);

    if (!getToken.statusCode) {
      const verifyUser = await User.findOne({
        where: {
          id: getToken.id,
        },
      });

      if (verifyUser) {
        if (verifyUser.isVerified) {
          return getResponse(
            StatusCodes.OK,
            ERROR_MESSAGES.USER.EMAIL_ALREADY_VERIFIED +
              SUCCESS_MESSAGES.USER.PLEASE_LOG_IN,
            ReasonPhrases.OK,
            verifyUser
          );
        } else {
          const updateUser = await User.update(
            { isVerified: true },
            { where: { id } }
          );
          if (!updateUser) {
            return getResponse(
              StatusCodes.INTERNAL_SERVER_ERROR,
              ERROR_MESSAGES.USER.COULD_NOT_VERIFY,
              ReasonPhrases.INTERNAL_SERVER_ERROR
            );
          } else {
            return getResponse(
              StatusCodes.OK,
              SUCCESS_MESSAGES.USER.EMAIL_VERIFIED,
              ReasonPhrases.OK
            );
          }
        }
      } else {
        return getResponse(
          StatusCodes.NOT_FOUND,
          ERROR_MESSAGES.USER.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }
    } else return getToken;
  } catch (error) {
    logger.error(`${error}`);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.VERIFY_EMAIL,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const userLoginService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      if (await compareHash(password, user.password)) {
        if (user.isVerified) {
          const response = getResponse(
            200,
            SUCCESS_MESSAGES.USER.LOGGED_IN,
            ReasonPhrases.OK
          );
          return addTokenToResponse(response, user);
        } else {
          return getResponse(
            StatusCodes.UNAUTHORIZED,
            ERROR_MESSAGES.USER.EMAIL_NOT_VERIFIED,
            ReasonPhrases.UNAUTHORIZED
          );
        }
      } else {
        return getResponse(
          StatusCodes.UNAUTHORIZED,
          ERROR_MESSAGES.USER.INCORRECT_EMAIL_OR_PASSWORD,
          ReasonPhrases.UNAUTHORIZED
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
    logger.error(`${error}`);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.LOG_IN,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const userForgotPassword = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return getResponse(
        StatusCodes.CONFLICT,
        ERROR_MESSAGES.USER.NOT_FOUND,
        ReasonPhrases.CONFLICT
      );
    }

    const token = signAccessToken({ id: user.id });
    await sendingMail({
      to: `${email}`,
      subject: "Password Reset Link",
      html: `<h1>Please reset your password</h1><br><p>Hello ${user.fullName}, please click on the link below:</p><br><a href=${BASE_URL}/users/reset-password/${user.id}/${token}>Reset your password</a>`,
    });
    return getResponse(
      StatusCodes.OK,
      SUCCESS_MESSAGES.USER.RESET_EMAIL_SENT,
      ReasonPhrases.OK
    );
  } catch (error) {
    logger.error(error);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.EMAIL_NOT_SENT,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const resetPasswordService = async (id, token, password) => {
  try {
    const getToken = verifyToken(token);

    if (!getToken.statusCode) {
      if (id == getToken.id) {
        const hashPassword = await hash(password);
        await User.update({ password: hashPassword }, { where: { id } });
        return getResponse(
          200,
          SUCCESS_MESSAGES.USER.PASSWORD_RESET_SUCCESS +
            SUCCESS_MESSAGES.USER.PLEASE_LOG_IN,
          ReasonPhrases.OK
        );
      } else {
        return getResponse(
          StatusCodes.UNAUTHORIZED,
          ERROR_MESSAGES.USER.INVALID_TOKEN,
          ReasonPhrases.UNAUTHORIZED
        );
      }
    } else return getToken;
  } catch (error) {
    logger.error(error);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.PASSWORD_RESET_FAIL,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const allUsersService = async () => {
  try {
    const users = await User.findAll();
    const response = getResponse(
      StatusCodes.OK,
      SUCCESS_MESSAGES.USER.FOUND,
      ReasonPhrases.OK,
      users
    );
    return response;
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.NOT_FOUND,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const userByIdService = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (user) {
      const response = getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.USER.FOUND,
        ReasonPhrases.OK,
        user
      );
      return response;
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
      ERROR_MESSAGES.USER.FETCH_USER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const updateUserService = async (id, fullName, avatar) => {
  try {
    const findUser = await User.findByPk(id);
    if (findUser) {
      const uploadedImage = await cloudinary.uploader.upload(avatar, {
        resource_type: "auto",
      });
      console.log(uploadedImage);
      await findUser.update(
        { fullName, avatar: uploadedImage.secure_url },
        { where: { id } }
      );
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.USER.UPDATED,
        ReasonPhrases.OK,
        uploadedImage.secure_url
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
      ERROR_MESSAGES.USER.FETCH_USER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteUserService = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (user) {
      await user.destroy();
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.USER.DELETED,
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
      ERROR_MESSAGES.USER.FETCH_USER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

//A CHECK TO SEE IF USER HAS TICKED REMEMBER ME
const userLogoutService = async (id) => {
  try {
    const user = await User.findByPk(id);

    if (user) {
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.USER.LOG_OUT,
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
      ERROR_MESSAGES.USER.LOG_OUT,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const refreshTokenService = async (token) => {
  try {
    const getToken = verifyToken(token);

    if (!getToken.statusCode) {
      const user = await User.findByPk(getToken.id);

      if (user) {
        const response = getResponse(
          StatusCodes.OK,
          SUCCESS_MESSAGES.USER.NEW_TOKEN,
          ReasonPhrases.OK
        );
        return addTokenToResponse(response, user);
      }
    }
    return getToken;
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.TOKEN,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const changePasswordService = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (user && (await compareHash(oldPassword, user.password))) {
      const newHashedPassword = await hash(newPassword);
      await user.update({ password: newHashedPassword });
      return getResponse(
        StatusCodes.OK,
        SUCCESS_MESSAGES.USER.PASSWORD_CHANGED,
        ReasonPhrases.OK
      );
    } else {
      return getResponse(
        StatusCodes.UNAUTHORIZED,
        ERROR_MESSAGES.USER.INCORRECT_PASSWORD,
        ReasonPhrases.UNAUTHORIZED
      );
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.USER.CHANGING_PASSWORD,
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  userSignUpService,
  verifyEmailService,
  userLoginService,
  userForgotPassword,
  resetPasswordService,
  allUsersService,
  userByIdService,
  updateUserService,
  deleteUserService,
  userLogoutService,
  refreshTokenService,
  changePasswordService,
};
