const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASSWORD } = require("../config");
const logger = require("../logger/logger");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require("../utils/constants/constants");

module.exports.sendingMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    // let mailOptions = {
    //   from,
    //   to,
    //   subject,
    //   html,
    // };

    await transporter.sendMail({
      to,
      subject,
      html,
    });
    // await new Promise((resolve, reject) => {
    //   // send mail
    //   transporter.sendMail(mailOptions, (err, info) => {
    //     if (err) {
    //       logger.error(ERROR_MESSAGES.USER.EMAIL_NOT_SENT, err);
    //       reject(err);
    //     } else {
    //       logger.info(SUCCESS_MESSAGES.USER.EMAIL_SENT);
    //       resolve(info);
    //     }
    //   });
    // });

    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     logger.error(ERROR_MESSAGES.USER.EMAIL_NOT_SENT, err);
    //     return err;
    //   } else logger.info(SUCCESS_MESSAGES.USER.EMAIL_SENT);
    // });
  } catch (error) {
    logger.error(error);
  }
};
