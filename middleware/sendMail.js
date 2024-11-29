import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Replace with Hostinger's SMTP server
  port: 465, // Use 587 for TLS or 465 for SSL
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




export const sendEmail = async (to, subject, text, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: "CEY4HUB<inquiry@cey4hub.com>", // Sender name and email
      to, // Recipient's email
      subject, // Subject line
      text, // Plain text body
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const personalizedTemplate = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);
  try {
    // Define email content
    const mailOptions = {
      from: "CEY4HUB<inquiry@cey4hub.com>", // Sender name and email
      to: email, // Recipient's email
      subject: "Welcome to Auth Company!",
      html: personalizedTemplate,
    };

    // Send the email
    const response = await transporter.sendMail(mailOptions);

    console.log("Welcome email sent successfully", response.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};
