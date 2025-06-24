import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const resetPasswordPageUrl =
  process.env.RESET_PASSWORD_PAGE_URL || "http://localhost:3001/reset-password";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp" with custom config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// HTML generators for different email types
function generateEmailContent(type: string, token: string): { subject: string; html: string; text: string } {
  switch (type) {
    case "registration":
      return {
        subject: "OTP for Registration",
        html: `<p>Your OTP for registration is: <strong>${token}</strong></p>`,
        text: `Your OTP for registration is: ${token}`,
      };

    case "reset":
      const resetLink = `${resetPasswordPageUrl}?token=${token}`;
      return {
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset for your account.</p>
          <p>Please click the following link to reset your password:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
        text: `Reset your password using this link: ${resetLink}. This link will expire in 1 hour.`,
      };

    default:
      throw new Error("Invalid email type. Supported types: registration, reset.");
  }
}

// Universal email sender
 async function sendEmail(
  email: string,
  token: string,
  type: "registration" | "reset"
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { subject, html, text } = generateEmailContent(type, token);

    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject,
      html,
      text,
    });

    // console.log(`Email sent to ${email}: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error(`Error sending ${type} email to ${email}:`, error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}


export { sendEmail };