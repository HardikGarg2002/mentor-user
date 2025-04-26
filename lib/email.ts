import nodemailer from "nodemailer";
import ses from "nodemailer-ses-transport";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create a transporter with Amazon SES
const createTransporter = async () => {
  // If we have AWS credentials, use Amazon SES
  if (
    process.env.AWS_SES_ACCESS_KEY &&
    process.env.AWS_SES_SECRET_KEY &&
    process.env.AWS_SES_REGION
  ) {
    // Configure Amazon SES transport
    return nodemailer.createTransport(
      ses({
        accessKeyId: process.env.AWS_SES_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_KEY,
        region: process.env.AWS_SES_REGION,
      })
    );
  }

  // Fallback to test account if AWS credentials aren't available
  console.warn("AWS SES credentials not found, using test account instead");
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const transporter = await createTransporter();

    // Get the from address from environment variable or use a default
    const fromAddress =
      process.env.AWS_SES_FROM_EMAIL || "noreply@mentormatch.com";

    const info = await transporter.sendMail({
      from: `"MentorMatch" <${fromAddress}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);

    // Get preview URL for Ethereal emails and display it prominently
    let previewUrl = null;
    if (info.messageId && info.messageId.includes("ethereal")) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("\n----------------------------");
      console.log(`📧 EMAIL PREVIEW URL: ${previewUrl}`);
      console.log("Copy and paste this URL in your browser to view the email");
      console.log("----------------------------\n");
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl, // Return the preview URL so it can be shown to the user
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export function createVerificationEmailHtml(
  name: string,
  verificationUrl: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to MentorMatch!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with MentorMatch. To complete your registration and verify your email address, please click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${verificationUrl}</p>
      <p>This verification link will expire in 24 hours.</p>
      <p>If you didn't create this account, you can safely ignore this email.</p>
      <p>Best regards,<br>The MentorMatch Team</p>
    </div>
  `;
}
