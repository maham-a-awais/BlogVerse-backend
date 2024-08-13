const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASSWORD } = require("../config");
const logger = require("../logger/logger");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../utils/constants/constants");

module.exports.sendingMail = async ({ from, to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    logger.info(SUCCESS_MESSAGES.USER.EMAIL_SENT);
    return true;
    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     logger.error(ERROR_MESSAGES.USER.EMAIL_NOT_SENT, err);
    //     return err;
    //   } else logger.info(SUCCESS_MESSAGES.USER.EMAIL_SENT);
    // });
  } catch (error) {
    logger.error(ERROR_MESSAGES.USER.EMAIL_NOT_SENT, error);
    throw error;
  }
};
