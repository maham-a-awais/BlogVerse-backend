const jwt = require("jsonwebtoken");
const { validate } = require("deep-email-validator");
const { sendingMail } = require("../nodemailer/mailing");
const { User, Token } = require("../models/index");
const logger = require("../logger/logger");
const { ReasonPhrases } = require("http-status-codes");
const { hash, compareHash } = require("../utils/helpers/bcryptHelper");
const {
  getResponse,
  addTokenToResponse,
} = require("../utils/helpers/getResponse");
const {
  SECRET_KEY,
  EMAIL,
  PASSWORD_RESET_EXPIRATION,
  JWT_EXPIRATION,
} = require("../config/localEnv");

//USER SIGN UP
const userSignUpService = async (fullName, email, password) => {
  try {
    const validationResult = await validate(email);
    if (!validationResult.valid) {
      return getResponse(
        400,
        "Invalid Email Address!",
        ReasonPhrases.BAD_REQUEST
      );
    }
    const user = await User.create({
      fullName,
      email,
      password: await hash(password),
    });

    if (user) {
      const token = await Token.create({
        userId: user.id,
        // token: crypto.randomBytes(16).toString("hex"),
        token: jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: JWT_EXPIRATION,
        }),
      });
      if (token) {
        sendingMail({
          from: EMAIL,
          to: `${email}`,
          subject: "Account Verification Link",
          html: `<h1>Please verify your account</h1><br><p>Hello ${fullName},To verify your account, pleace click on the link below:</p><br><a href=http://localhost:3000/api/users/verify-email/${user.id}/${token.token}>Verification Link</a>`,
        });
      } else {
        return getResponse(
          500,
          "Token could not be generated",
          ReasonPhrases.INTERNAL_SERVER_ERROR
        );
      }
      const response = getResponse(
        201,
        "User Created!",
        ReasonPhrases.OK,
        user
      );
      return addTokenToResponse(response, user);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error signing up!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

//VERIFY USER EMAIL
const verifyEmailService = async (token, id) => {
  try {
    const userToken = await Token.findOne({
      token,
      where: {
        userId: id,
      },
    });
    if (!userToken) {
      return getResponse(
        502,
        "Your verification link may have expired. Please click on resend for verify your email",
        ReasonPhrases.BAD_GATEWAY
      );
    } else {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        logger.info(user);
        return getResponse(
          404,
          "We were unable to find a user for this verification. Please sign up!",
          ReasonPhrases.NOT_FOUND
        );
      } else if (user.isVerified) {
        return getResponse(
          200,
          "User has already been verified. Please login",
          ReasonPhrases.OK,
          user
        );
      } else {
        const updateUser = await User.update(
          { isVerified: true },
          { where: { id } }
        );
        if (!updateUser) {
          return getResponse(
            500,
            "User could not be verified",
            ReasonPhrases.INTERNAL_SERVER_ERROR
          );
        } else {
          return getResponse(200, "User has been verified", ReasonPhrases.OK);
        }
      }
    }
  } catch (error) {
    logger.error(`${error}`);
    return getResponse(
      500,
      "Error verifying email!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

//USER LOGIN
const userLoginService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      // const isSame = await bcrypt.compare(password, user.password);
      if (compareHash(password, user.password)) {
        if (user.isVerified) {
          const response = getResponse(
            200,
            "User is verified. Login Successful!",
            ReasonPhrases.OK
          );
          return addTokenToResponse(response, user);
        } else {
          return getResponse(
            401,
            "User is not verified",
            ReasonPhrases.UNAUTHORIZED
          );
        }
      } else {
        return getResponse(
          401,
          "Authentication failed. Invalid credentials!",
          ReasonPhrases.UNAUTHORIZED
        );
      }
    } else {
      return getResponse(404, "User doesn't exist", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(`${error}`);
    return getResponse(
      500,
      "Error logging in!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

//USER FORGOT PASSWORD
const userForgotPassword = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return getResponse(409, "Email doesn't exist!", ReasonPhrases.CONFLICT);
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: PASSWORD_RESET_EXPIRATION,
    });
    const errorSendingMail = sendingMail({
      from: EMAIL,
      to: `${email}`,
      subject: "Password Reset Link",
      html: `<h1>Please reset your password</h1><br><p>Hello ${user.fullName}, please click on the link below:</p><br><a href=http://localhost:3000/api/users/reset-password/${user.id}/${token}>Reset your password</a>`,
    });
    if (!errorSendingMail) {
      return getResponse(
        500,
        "Email could not be sent!",
        ReasonPhrases.INTERNAL_SERVER_ERROR
      );
    } else {
      return getResponse(
        200,
        "Password reset link has been sent to your email",
        ReasonPhrases.OK
      );
    }
  } catch (error) {
    logger.error(`Middleware: ${error}`);
    return getResponse(
      500,
      "Error! Password link could not be sent.",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

//USER RESET PASSWORD
const resetPasswordService = async (id, token, password) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (id == decodedToken.id) {
      const hashPassword = await hash(password);
      await User.update({ password: hashPassword }, { where: { id } });
      return getResponse(
        200,
        "Successful Password Reset! Please login to your account",
        ReasonPhrases.OK
      );
    } else {
      return getResponse(401, "Invalid token!", ReasonPhrases.UNAUTHORIZED);
    }
  } catch (error) {
    logger.error(`Error in reset password: ${error}`);
    return getResponse(
      500,
      "Password could not be reset!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const allUsersService = async () => {
  try {
    const users = await User.findAll();
    const response = getResponse(200, "Users Found!", ReasonPhrases.OK, users);
    return response;
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error find users!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const userByIdService = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      const response = getResponse(200, "User found!", ReasonPhrases.OK, user);
      return response;
    } else {
      return getResponse(
        404,
        "User could not be found!",
        ReasonPhrases.NOT_FOUND
      );
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error fetching user!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const updateUserService = async (id, email, fullName, password, avatar) => {
  try {
    const findUser = await User.findByPk(id);
    if (findUser) {
      await findUser.update(
        { email, fullName, password, avatar },
        { where: { id } }
      );
      return getResponse(200, "User updated!", ReasonPhrases.OK);
    } else {
      return getResponse(404, "User not found", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error fetching user!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteUserService = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      return getResponse(200, "User Deleted Successfully!", ReasonPhrases.OK);
    } else {
      return getResponse(404, "User not found", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error fetching user!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
  }
};

//A CHECK TO SEE IF USER IS LOGGED IN OR NOT
const userLogoutService = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      return getResponse(200, "Logout Sucessful", ReasonPhrases.OK);
    } else {
      return getResponse(404, "User not found", ReasonPhrases.NOT_FOUND);
    }
  } catch (error) {
    logger.error(error.message);
    return getResponse(
      500,
      "Error logging out!!",
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
};
