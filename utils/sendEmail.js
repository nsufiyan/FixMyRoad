const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fixmyroadteam@gmail.com",//emailID used to send the emails
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const sendEmail = async ({ subject, to, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"team fixmyroad" <${process.env.ADMIN_EMAIL}>`,
      to: to, //"syedsaqeefhussain@gmail.com",
      subject: subject, //"Hello",
      text: text, //"Hello world?", // plain‑text body
      html: html, //"<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { sendEmail };
