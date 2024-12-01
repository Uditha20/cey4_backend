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
    <h2>Thank you for your order!</h2>
    <p>Your order has been confirmed. Below are your order details:</p>

    <h4>Order ID:</h4>
    <p>${order._id}</p>
    
    ${itemsHtml}  <!-- Items List -->

    <h4>Billing Information:</h4>
    ${billingInfoHtml}  <!-- Billing Information -->

    <h4>Total:</h4>
    <p><strong>Overall Total: </strong>$${order.overallTotal.toFixed(2)}</p>
    
    <p>We appreciate your business and look forward to serving you again!</p>
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