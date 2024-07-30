const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validate } = require("deep-email-validator");
const { sendingMail } = require("../nodemailer/mailing");
const { User, Token } = require("../models/index");
const logger = require("../logger/logger");
const responseStructure = require("../utils/helpers/responseStructure");
const { ReasonPhrases } = require("http-status-codes");
const { hash, compareHash } = require("../utils/helpers/bcryptHelper");
const {
  SECRET_KEY,
  EMAIL,
  PASSWORD_RESET_EXPIRATION,
} = require("../config/.localEnv");

//USER SIGN UP
const userSignUpService = async (fullName, email, password) => {
  try {
    const validationResult = await validate(email);
    if (!validationResult.valid) {
      const result = responseStructure(
        400,
        "Invalid Email Address!",
        ReasonPhrases.BAD_REQUEST
        // validationResult.reason
      );
      return result;
    }
    const user = await User.create({
      fullName,
      email,
      password: await hash(password),
    });

    if (user) {
      const token = await Token.create({
        userId: user.id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      if (token) {
        sendingMail({
          from: EMAIL,
          to: `${email}`,
          subject: "Account Verification Link",
          html: `<h1>Please verify your account</h1><br><p>Hello ${fullName},To verify your account, pleace click on the link below:</p><br><a href=http://localhost:3000/api/users/verify-email/${user.id}/${token.token}>Verification Link</a>`,
        });
      } else {
        const result = responseStructure(
          500,
          "Token could not be generated",
          ReasonPhrases.INTERNAL_SERVER_ERROR
        );
        return result;
      }
      const result = responseStructure(
        201,
        "User Created!",
        ReasonPhrases.OK,
        user
      );
      return result;
    }
  } catch (error) {
    logger.error(error, "This is an error:");
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
      const result = responseStructure(
        502,
        "Your verification link may have expired. Please click on resend for verify your email",
        ReasonPhrases.BAD_GATEWAY
      );
      return result;
    } else {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        logger.info(user);
        const result = responseStructure(
          404,
          "We were unable to find a user for this verification. Please sign up!",
          ReasonPhrases.NOT_FOUND
        );
        return result;
      } else if (user.isVerified) {
        const result = responseStructure(
          200,
          "User has already been verified. Please login",
          ReasonPhrases.OK,
          user
        );
        return result;
      } else {
        const updateUser = await User.update(
          { isVerified: true },
          { where: { id } }
        );
        if (!updateUser) {
          const result = responseStructure(
            500,
            "User could not be verified",
            ReasonPhrases.INTERNAL_SERVER_ERROR
          );
          return result;
        } else {
          const result = responseStructure(
            200,
            "User has been verified",
            ReasonPhrases.OK
          );
          return result;
        }
      }
    }
  } catch (error) {
    logger.error(`${error}`);
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
          const result = responseStructure(
            200,
            "User is verified. Login Successful!",
            ReasonPhrases.OK
          );
          return result;
        } else {
          const result = responseStructure(
            401,
            "User is not verified",
            ReasonPhrases.UNAUTHORIZED
          );
          return result;
        }
      } else {
        const result = responseStructure(
          401,
          "Authentication failed. Invalid credentials!",
          ReasonPhrases.UNAUTHORIZED
        );
        return result;
      }
    } else {
      const result = responseStructure(
        404,
        "User doesn't exist",
        ReasonPhrases.NOT_FOUND
      );
      return result;
    }
  } catch (error) {
    logger.error(`${error}`);
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
      const result = responseStructure(
        409,
        "Email doesn't exist!",
        ReasonPhrases.CONFLICT
      );
      return result;
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: PASSWORD_RESET_EXPIRATION,
    });
    const errorSendingMail = sendingMail({
      from: EMAIL,
      to: `${email}`,
      subject: "Password Reset Link",
      html: `<h1>Please reset your password</h1><br><p>Hello ${user.fullName}, pleace click on the link below:</p><br><a href=http://localhost:3000/api/users/reset-password/${user.id}/${token}>Reset your password</a>`,
    });
    if (!errorSendingMail) {
      const result = responseStructure(
        500,
        "Email could not be sent!",
        ReasonPhrases.INTERNAL_SERVER_ERROR
      );
      return result;
    } else {
      const result = responseStructure(
        200,
        "Password reset link has been sent to your email",
        ReasonPhrases.OK
      );
      return result;
    }
  } catch (error) {
    logger.error(`Middleware: ${error}`);
  }
};

//USER RESET PASSWORD
const resetPasswordService = async (id, token, password) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (id == decodedToken.id) {
      const hashPassword = await hash(password);
      await User.update({ password: hashPassword }, { where: { id } });
      const result = responseStructure(
        200,
        "Successful Password Reset! Please login to your account",
        ReasonPhrases.OK
      );
      return result;
    } else {
      const result = responseStructure(
        401,
        "Invalid token!",
        ReasonPhrases.UNAUTHORIZED
      );
      return result;
    }
  } catch (error) {
    logger.error(`Error in reset password: ${error}`);
  }
};

const allUsersService = async () => {
  try {
    const users = await User.findAll();
    const result = responseStructure(
      200,
      "Users Found!",
      ReasonPhrases.OK,
      users
    );
    return result;
  } catch (error) {
    const result = responseStructure(
      500,
      "Error find users!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
    return result;
  }
};

const userByIdService = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      const result = responseStructure(
        200,
        "User found!",
        ReasonPhrases.OK,
        user
      );
      return result;
    } else {
      const result = responseStructure(
        404,
        "User could not be found!",
        ReasonPhrases.NOT_FOUND
      );
      return result;
    }
  } catch (error) {
    const result = responseStructure(
      500,
      "Error fetching user!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
    return result;
  }
};

const updateUserService = async (id, email, fullName, password, avatar) => {
  try {
    const findUser = await User.findByPk(id);
    if (findUser) {
      const user = await findUser.update(
        { email, fullName, password, avatar },
        { where: { id } }
      );
      const result = responseStructure(200, "User updated!", ReasonPhrases.OK);
      return result;
    } else {
      const result = responseStructure(
        404,
        "User not found",
        ReasonPhrases.NOT_FOUND
      );
      return result;
    }
  } catch (error) {
    const result = responseStructure(
      500,
      "Error fetching user!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
    return result;
  }
};

const deleteUserService = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      const result = responseStructure(
        200,
        "User Deleted Successfully!",
        ReasonPhrases.OK
      );
      return result;
    } else {
      const result = responseStructure(
        404,
        "User not found",
        ReasonPhrases.NOT_FOUND
      );
      return result;
    }
  } catch (error) {
    const result = responseStructure(
      500,
      "Error fetching user!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
    return result;
  }
};

//A CHECK TO SEE IF USER IS LOGGED IN OR NOT
const userLogoutService = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (user) {
      const result = responseStructure(
        200,
        "Logout Sucessful",
        ReasonPhrases.OK
      );
      return result;
    } else {
      const result = responseStructure(
        404,
        "User not found",
        ReasonPhrases.NOT_FOUND
      );
      return result;
    }
  } catch (error) {
    const result = responseStructure(
      500,
      "Error loggingout!!",
      ReasonPhrases.INTERNAL_SERVER_ERROR
    );
    return result;
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
