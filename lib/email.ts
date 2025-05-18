import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { EMAIL, APP, UI } from "@/config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create SES client
const createSESClient = () => {
  if (
    process.env.AWS_SES_ACCESS_KEY &&
    process.env.AWS_SES_SECRET_KEY &&
    process.env.AWS_SES_REGION
  ) {
    return new SESClient({
      region: process.env.AWS_SES_REGION,
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_KEY,
      },
    });
  }
  return null;
};

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const sesClient = createSESClient();
    const fromAddress = EMAIL.FROM;

    if (sesClient) {
      // Use AWS SES
      const command = new SendEmailCommand({
        Source: `"${APP.NAME}" <${fromAddress}>`,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: html,
            },
          },
        },
      });

      const result = await sesClient.send(command);
      console.log(`Email sent: ${result.MessageId}`);
      return { success: true, messageId: result.MessageId };
    } else {
      // Fallback to SMTP if configured
      if (EMAIL.SMTP.HOST && EMAIL.SMTP.USER && EMAIL.SMTP.PASSWORD) {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: EMAIL.SMTP.HOST,
          port: EMAIL.SMTP.PORT,
          secure: EMAIL.SMTP.PORT === 465,
          auth: {
            user: EMAIL.SMTP.USER,
            pass: EMAIL.SMTP.PASSWORD,
          },
        });

        const info = await transporter.sendMail({
          from: `"${APP.NAME}" <${fromAddress}>`,
          to,
          subject,
          html,
        });

        console.log(`Email sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      }

      // Development fallback
      console.warn("Email credentials not found, using test account instead");
      const nodemailer = await import("nodemailer");
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${APP.NAME}" <${fromAddress}>`,
        to,
        subject,
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("\n----------------------------");
      console.log(`📧 EMAIL PREVIEW URL: ${previewUrl}`);
      console.log("Copy and paste this URL in your browser to view the email");
      console.log("----------------------------\n");

      return { success: true, messageId: info.messageId, previewUrl };
    }
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
    <div style="font-family: ${UI.TYPOGRAPHY.fontFamily.sans}; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ${APP.NAME}!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with ${APP.NAME}. To complete your registration and verify your email address, please click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: ${UI.COLORS.primary[500]}; color: white; padding: 12px 24px; text-decoration: none; border-radius: ${UI.BORDER_RADIUS.md}; font-weight: bold;">Verify Email Address</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${verificationUrl}</p>
      <p>This verification link will expire in 24 hours.</p>
      <p>If you didn't create this account, you can safely ignore this email.</p>
      <p>Best regards,<br>The ${APP.NAME} Team</p>
    </div>
  `;
}

export function createSessionConfirmationEmailHtml(
  name: string,
  sessionDetails: {
    date: string;
    time: string;
    duration: string;
    mentorName: string;
    topic: string;
    meetingLink?: string;
  }
) {
  return `
    <div style="font-family: ${
      UI.TYPOGRAPHY.fontFamily.sans
    }; max-width: 600px; margin: 0 auto;">
      <h2>Session Confirmation</h2>
      <p>Hello ${name},</p>
      <p>Your session has been successfully booked! Here are the details:</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: ${
        UI.BORDER_RADIUS.md
      }; margin: 20px 0;">
        <p><strong>Date:</strong> ${sessionDetails.date}</p>
        <p><strong>Time:</strong> ${sessionDetails.time}</p>
        <p><strong>Duration:</strong> ${sessionDetails.duration}</p>
        <p><strong>Mentor:</strong> ${sessionDetails.mentorName}</p>
        <p><strong>Topic:</strong> ${sessionDetails.topic}</p>
      </div>
      ${
        sessionDetails.meetingLink
          ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${sessionDetails.meetingLink}" style="background-color: ${UI.COLORS.primary[500]}; color: white; padding: 12px 24px; text-decoration: none; border-radius: ${UI.BORDER_RADIUS.md}; font-weight: bold;">Join Session</a>
        </div>
      `
          : ""
      }
      <p>Please make sure to join the session on time. If you need to reschedule, please do so at least 24 hours before the session.</p>
      <p>Best regards,<br>The ${APP.NAME} Team</p>
    </div>
  `;
}

export function createSessionReminderEmailHtml(
  name: string,
  sessionDetails: {
    date: string;
    time: string;
    duration: string;
    mentorName: string;
    topic: string;
    meetingLink?: string;
  }
) {
  return `
    <div style="font-family: ${
      UI.TYPOGRAPHY.fontFamily.sans
    }; max-width: 600px; margin: 0 auto;">
      <h2>Session Reminder</h2>
      <p>Hello ${name},</p>
      <p>This is a reminder about your upcoming session:</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: ${
        UI.BORDER_RADIUS.md
      }; margin: 20px 0;">
        <p><strong>Date:</strong> ${sessionDetails.date}</p>
        <p><strong>Time:</strong> ${sessionDetails.time}</p>
        <p><strong>Duration:</strong> ${sessionDetails.duration}</p>
        <p><strong>Mentor:</strong> ${sessionDetails.mentorName}</p>
        <p><strong>Topic:</strong> ${sessionDetails.topic}</p>
      </div>
      ${
        sessionDetails.meetingLink
          ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${sessionDetails.meetingLink}" style="background-color: ${UI.COLORS.primary[500]}; color: white; padding: 12px 24px; text-decoration: none; border-radius: ${UI.BORDER_RADIUS.md}; font-weight: bold;">Join Session</a>
        </div>
      `
          : ""
      }
      <p>Please make sure to join the session on time. If you need to reschedule, please contact us immediately.</p>
      <p>Best regards,<br>The ${APP.NAME} Team</p>
    </div>
  `;
}
