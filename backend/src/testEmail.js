import "dotenv/config";
import sendEmail from "./utils/sendEmail.js";

try {
  await sendEmail({
    email: "ayushmamgain349@gmail.com",
    subject: "SMTP Test",
    message: "<h2>Gmail SMTP is working!</h2><p>Your backend can now send emails.</p>",
  });

  console.log("Email sent successfully!");
} catch (error) {
  console.error("Email sending failed:", error);
}