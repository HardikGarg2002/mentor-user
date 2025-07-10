import { Resend } from "resend";
import { EMAIL, APP, UI } from "@/config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const fromAddress = EMAIL.FROM;

  try {
    if (process.env.RESEND_API_KEY) {
      // Use Resend
      const { data, error } = await resend.emails.send({
        from: `"${APP.NAME}" <${fromAddress}>`,
        to,
        subject,
        html,
      });

      if (error) {
        console.error("Resend error:", error);
        throw new Error(error.message || "Failed to send email");
      }

      console.log(`Email sent via Resend: ${data?.id}`);
      return { success: true, messageId: data?.id };
    }

    // Fallback to SMTP if Resend not configured
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

      console.log(`Email sent via SMTP: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    }

    // Development fallback using Ethereal
    console.warn("No email provider configured, using test account");
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
    console.log(`📧 EMAIL PREVIEW URL: ${previewUrl}`);

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
