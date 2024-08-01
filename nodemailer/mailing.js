const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASSWORD } = require("../config");
const logger = require("../logger/logger");
const { error } = require("winston");

module.exports.sendingMail = async ({ from, to, subject, html }) => {
  try {
    let mailOptions = {
      from,
      to,
      subject,
      html,
    };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(`Error sending email: ${error}`);
        return err;
      } else logger.info(`Email sent successfully!`);
    });
  } catch (error) {
    logger.error(error);
  }
};
