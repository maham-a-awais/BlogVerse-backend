import { logger } from "../logger";
import nodemailer from "nodemailer";
import { config } from "../config";
import { GENERAL_INFO, SUCCESS_MESSAGES } from "../utils/constants";
import { MailOptions } from "../types";

const { EMAIL, EMAIL_PASSWORD } = config;

/**
 * Sends an email using nodemailer
 * @param {MailOptions} mailOptions - options for the email
 * @param {string} mailOptions.to - the recipient of the email
 * @param {string} mailOptions.subject - the subject of the email
 * @param {string} mailOptions.html - the content of the email in html format
 * @returns {Promise<void>} - a promise that resolves if the email is sent successfully
 */
export const sendingMail = async ({ to, subject, html }: MailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: GENERAL_INFO.EMAIL_SERVICE,
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
          console.log(SUCCESS_MESSAGES.SUCCESS);
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
