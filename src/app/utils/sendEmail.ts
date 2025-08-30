/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVas } from "../config/env";
import AppError from "../errorHelpers/AppError";

const transporter = nodemailer.createTransport({
  host: envVas.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVas.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVas.EMAIL_SENDER.SMTP_USER,
    pass: envVas.EMAIL_SENDER.SMTP_PASS,
  },
});

interface SendEmailOption {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOption) => {
  try {
    const templatePath = path.join(__dirname, `template/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVas.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  } catch (error) {
    console.log(error);
    throw new AppError(401, "Email error");
  }
};
