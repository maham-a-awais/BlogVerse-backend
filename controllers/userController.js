const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const responseStructure = require("../utils/helpers/responseStructure");
const { validate } = require("deep-email-validator");
const { User, Token } = require("../models/index");
const { sendingMail } = require("../nodemailer/mailing");
const { SECRET_KEY, JWT_EXPIRATION, EMAIL } = require("../config/.localEnv");

const signUp = async (req, res) => {
  try {
    const { email, password, fullName, isVerified } = req.body;
    const validationResult = await validate(email);

    if (!validationResult.valid) {
      return res
        .status(400)
        .json(responseStructure(400, "Invalid Email", "Fail"));
    }
    const salt = await bcrypt.genSalt(10);
    const user = await User.create({
      fullName,
      email,
      password: await bcrypt.hash(password, 10),
      isVerified,
    });

    if (user) {
      const token = await Token.create({
        userId: user.id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      if (token) {
        sendingMail({
          from: "no-reply@gmail.com",
          to: `${email}`,
          subject: "Account Verification Link",
          html: `<h1>Please verify your account</h1><br><p>Hello ${fullName},To verify your account, pleace click on the link below:</p><br><a href=http://localhost:3000/api/users/verify-email/${user.id}/${token.token}>Verification Link</a>`,
        });
      } else {
        res.status(400).json({ message: "Failed to create token" });
      }
      console.log("user", JSON.stringify(user, null, 2));
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    }
  } catch (error) {
    console.log(error);
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
    console.log(userToken);
    if (!userToken) {
      return res.status(400).json({
        message:
          "Your verification link may have expired. Please click on resend for verify your email",
      });
    } else {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        console.log(user);
        return res.status(401).send({
          message:
            "We were unable to find a user for this verification. Please sign up!",
        });
      } else if (user.isVerified) {
        return res
          .status(200)
          .send("User has already been verified. Please login");
      } else {
        const updateUser = await User.update(
          { isVerified: true },
          { where: { id } }
        );
        console.log(updateUser);
        if (!updateUser) {
          return res.status(500).send({ message: error.message });
        } else {
          return res.status(200).send("User has been verified");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    console.log(user);
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
          console.log("user", JSON.stringify(user));
          console.log(token);

          return res.status(201).send(user);
        } else {
          return res.status(401).send("User not verified");
        }
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signUp,
  login,
  verifyEmail,
};
