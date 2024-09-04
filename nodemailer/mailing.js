const logger = require("../logger/logger");
const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASSWORD } = require("../config");

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

    await transporter.sendMail({
      to,
      subject,
      html,
    });
  } catch (error) {
    logger.error(error);
  }
};
