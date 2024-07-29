const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, Token } = require("../models/index");
const { sendingMail } = require("../nodemailer/mailing");
const {
  SECRET_KEY,
  JWT_EXPIRATION,
  EMAIL,
  PASSWORD_RESET_EXPIRATION,
} = require("../config/.localEnv");
const logger = require("../logger/logger");
const responseStructure = require("../utils/helpers/responseStructure");
const { error } = require("winston");

const signUp = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const user = await User.create({
      fullName,
      email,
      password: await bcrypt.hash(password, 10),
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
        res.status(400).json(responseStructure(400, "Internal Server Error"));
      }
      return res
        .status(201)
        .json(responseStructure(201, "User created successfully", user));
    }
  } catch (error) {
    logger.error(error, "This is an error:");
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token, id } = req.params;
    const userToken = await Token.findOne({
      token,
      where: {
        userId: id,
      },
    });
    logger.info(userToken);
    if (!userToken) {
      return res
        .status(400)
        .json(
          responseStructure(
            400,
            "Your verification link may have expired. Please click on resend for verify your email"
          )
        );
    } else {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        logger.info(user);
        return res
          .status(401)
          .send(
            responseStructure(
              401,
              "We were unable to find a user for this verification. Please sign up!"
            )
          );
      } else if (user.isVerified) {
        return res
          .status(200)
          .send(
            responseStructure(
              200,
              "User has already been verified. Please login"
            )
          );
      } else {
        const updateUser = await User.update(
          { isVerified: true },
          { where: { id } }
        );
        logger.info(updateUser);
        if (!updateUser) {
          return res
            .status(500)
            .send(responseStructure(500, "User could not be verified"));
        } else {
          return res
            .status(200)
            .send(responseStructure(200, "User has been verified", updateUser));
        }
      }
    }
  } catch (error) {
    logger.error(`${error}`);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    logger.info(user);
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        if (user.isVerified) {
          let token = jwt.sign({ id: user.id }, SECRET_KEY, {
            expiresIn: JWT_EXPIRATION,
          });
          res.cookie("jwt", token, {
            maxAge: 1 * 24 * 60 * 60,
            httpOnly: true,
          });
          logger.info(JSON.stringify(user));
          logger.info(token);

          return res
            .status(200)
            .send(responseStructure(200, "User is verified", user));
        } else {
          return res
            .status(401)
            .send(responseStructure(401, "User is not verified"));
        }
      } else {
        return res
          .status(401)
          .send(responseStructure(401, "Authentication failed"));
      }
    } else {
      return res
        .status(401)
        .send(responseStructure(401, "Authentication failed"));
    }
  } catch (error) {
    logger.error(`${error}`);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res
        .status(409)
        .json(responseStructure(409, "Email doesn't exist!"));
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: PASSWORD_RESET_EXPIRATION,
    });
    const errorSendingMail = sendingMail({
      from: EMAIL,
      to: `${email}`,
      subject: "Password Reset Link",
      html: `<h1>Please reset your password</h1><br><p>Hello ${fullName}, pleace click on the link below:</p><br><a href=http://localhost:3000/api/users/reset-password/${user.id}/${token}>Reset your password</a>`,
    });
    if (errorSendingMail)
      return res
        .status(501)
        .json(
          responseStructure(501, "Email could not be sent!", "Server Error")
        );
  } catch (error) {
    logger.error(`Middleware: ${error}`);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (id === decodedToken.id) {
      const saltRounds = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, saltRounds);
      await User.findbyIdAndUpdate({ id }, { password: hashPassword });
      return res
        .status(201)
        .json(responseStructure(201, "Successful Password Reset!"));
    }
  } catch (error) {
    logger.error(`Error in reset password: ${error}`);
  }
};

module.exports = {
  signUp,
  login,
  verifyEmail,
  forgotPassword,
};
