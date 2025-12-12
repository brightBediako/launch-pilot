import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

// Create reusable transporter
const createTransporter = () => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    logger.warn("Email configuration missing. Emails will not be sent.");
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send welcome email to new subscriber
 * @param {Object} subscriber - Subscriber data
 * @param {Object} launchPage - Launch page data
 * @returns {Promise}
 */
export const sendWelcomeEmail = async (subscriber, launchPage) => {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn("Email transporter not configured");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: subscriber.email,
      subject: `Thanks for your interest in ${launchPage.content.headline}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: ${launchPage.theme.primaryColor || "#3B82F6"};">
            Thanks for signing up!
          </h1>
          <p>Hi ${subscriber.name || "there"},</p>
          <p>Thank you for your interest in <strong>${
            launchPage.content.headline
          }</strong>!</p>
          <p>We'll keep you updated with our launch progress and let you know as soon as we go live.</p>
          <p>In the meantime, feel free to reply to this email with any questions.</p>
          <br>
          <p>Best regards,<br>The ${launchPage.content.headline} Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            You received this email because you signed up at our launch page. 
            If you didn't sign up, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${subscriber.email}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error sending welcome email: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send launch notification to all subscribers
 * @param {Array} subscribers - Array of subscribers
 * @param {Object} launch - Launch data
 * @param {Object} launchPage - Launch page data
 * @returns {Promise}
 */
export const sendLaunchNotification = async (
  subscribers,
  launch,
  launchPage
) => {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn("Email transporter not configured");
    return { success: false, message: "Email service not configured" };
  }

  const results = {
    sent: 0,
    failed: 0,
    errors: [],
  };

  for (const subscriber of subscribers) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: subscriber.email,
        subject: `🚀 ${launchPage.content.headline} is now live!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: ${launchPage.theme.primaryColor || "#3B82F6"};">
              🚀 We're Live!
            </h1>
            <p>Hi ${subscriber.name || "there"},</p>
            <p>Great news! <strong>${
              launchPage.content.headline
            }</strong> has officially launched!</p>
            <p>${launchPage.content.subheadline || launch.description}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${launchPage.content.cta.url || launch.websiteUrl}" 
                 style="background-color: ${
                   launchPage.theme.primaryColor || "#3B82F6"
                 }; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;">
                ${launchPage.content.cta.text || "Check it out now"}
              </a>
            </div>
            <p>Thank you for your support. We can't wait to hear what you think!</p>
            <br>
            <p>Best regards,<br>The ${launchPage.content.headline} Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      results.sent++;
      logger.info(`Launch notification sent to ${subscriber.email}`);
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: subscriber.email,
        error: error.message,
      });
      logger.error(
        `Error sending launch notification to ${subscriber.email}: ${error.message}`
      );
    }
  }

  return results;
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise}
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn("Email transporter not configured");
    return { success: false };
  }

  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your LAUNCHPILOT account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3B82F6; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error sending password reset email: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export default {
  sendWelcomeEmail,
  sendLaunchNotification,
  sendPasswordResetEmail,
};
