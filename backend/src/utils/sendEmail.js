import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async ({ email, subject, message }) => {
  await transporter.sendMail({
    from: `"Career Compass" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html: message,
  });
};

export default sendEmail;