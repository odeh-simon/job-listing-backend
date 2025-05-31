import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import env from '../utils/env.utils';

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: env.SENDGRID_API_KEY,
    },
  })
);

export async function sendApplicationConfirmation(to: string, fullName: string, jobTitle: string) {
  await transporter.sendMail({
    to,
    from: env.SMTP_FROM,
    subject: 'Application Received',
    html: `<p>Dear ${fullName},</p><p>Your application for ${jobTitle} has been received. We'll reach out soon for further steps.</p><p>Lookout for follow up email on your inbox/spam</p> <p>Thank you!</p>`,
  });
}

export async function sendDocumentUploadRequest(to: string, fullName: string, applicationId: number, token: string) {
  const uploadLink = `${token}`;
  await transporter.sendMail({
    to,
    from: env.SMTP_FROM,
    subject: 'Upload Additional Documents',
    html: `<p>Dear ${fullName},</p><p>Please upload additional documents for your application (ID: ${applicationId}) using this link: <a href="${uploadLink}">${uploadLink}</a>.</p><p>Thank you!</p>`,
  });
}

export async function sendDocumentAcknowledgment(to: string, fullName: string) {
  await transporter.sendMail({
    to,
    from: env.SMTP_FROM,
    subject: 'Documents Received',
    html: `<p>Dear ${fullName},</p><p>We have received your additional documents. Please reply to this email with a suitable date and time for facial verification.</p><p>Thank you!</p>`,
  });
}