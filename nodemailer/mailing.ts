import { logger } from "../logger";
import nodemailer from "nodemailer";
import { config } from "../config";
import { GENERAL_INFO, SUCCESS_MESSAGES } from "../utils/constants";

const { EMAIL, EMAIL_PASSWORD } = config;

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
