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
      subject: "Welcome to CEY4HUB..",
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

export const sendOrderEmail = async (email, order) => {
  // Map the order data to a readable format for the email
  const itemsHtml = order.items.map(item => {
    return `
      <p><strong>Product:</strong> ${item.product.name}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <hr>
    `;
  }).join(""); // Join all item details together

  const billingInfoHtml = `
    <h4>Billing Information:</h4>
    <p><strong>Name:</strong> ${order.billingInfo.firstName} ${order.billingInfo.lastName}</p>
    <p><strong>Company:</strong> ${order.billingInfo.companyName || 'N/A'}</p>
    <p><strong>Address:</strong> ${order.billingInfo.streetAddress}, ${order.billingInfo.apartment ? order.billingInfo.apartment + ', ' : ''}${order.billingInfo.city}, ${order.billingInfo.state}, ${order.billingInfo.postalCode}</p>
    <p><strong>Country:</strong> ${order.billingInfo.country}</p>
    <p><strong>Phone:</strong> ${order.billingInfo.phone}</p>
    <p><strong>Email:</strong> ${order.billingInfo.email}</p>
  `;

  const orderDetailsTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Order Confirmation</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Hello ${order.billingInfo.firstName},</p>
        <p>Thank you for your order! Your order has been confirmed. Below are your order details:</p>
        
        <h4>Order ID:</h4>
        <p>${order._id}</p>

        <h4>Items:</h4>
        ${itemsHtml}

        ${billingInfoHtml}

        <h4>Total:</h4>
        <p><strong>Overall Total: </strong>${order.overallTotal.toFixed(2)}</p>

        <p>You will receive another email once your order has been shipped, with tracking details.</p>

        <p>If you have any questions, feel free to contact our customer support team at <a href="mailto:support@cey4hub.com">support@cey4hub.com</a> or call us at +44 (0) 20 3371 1782.</p>
        
        <p>Thank you for choosing Cey4Hub. We appreciate your business and look forward to serving you again.</p>
        
        <p>Best regards,<br>Cey4Hub Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Define email content
    const mailOptions = {
      from: "CEY4HUB <inquiry@cey4hub.com>", // Sender name and email
      to: email, // Recipient's email
      subject: "Order Confirmation",
      html: orderDetailsTemplate, // HTML content with mapped order details
    };

    // Send the email
    const response = await transporter.sendMail(mailOptions);

    console.log(
      "Order confirmation email sent successfully",
      response.messageId
    );
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw new Error(`Error sending order confirmation email: ${error.message}`);
  }
};
