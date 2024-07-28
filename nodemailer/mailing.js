const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../config/.localEnv");

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
        pass: PASSWORD,
      },
    });
    await transporter.sendMail(mailOptions);
    console.log("EMAIL sent successfully");
  } catch (error) {
    console.log(error);
  }
};
