import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import env from './env.utils';

// Email header and footer templates
const emailHeader = `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 20px 0; text-align: center; background-color: blue; height: 40px; width:full;">
        <img src="https://res.cloudinary.com/da8cw7lxs/image/upload/v1748881182/logo_gjbycy.jpg" alt="Koovly Careers Logo" style="max-width: 150px; height: 30px;" />
        <h1 style="font-size: 24px; color: #ffffff; margin: 10px 0;">Koovly Careers</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
`;

const emailFooter = `
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #666666;">
        <p style="margin: 5px 0;">
          <a href="https://koovly.com" style="color: #4A90E2; text-decoration: none;">Website</a> | 
          <a href="https://koovly.com/jobs" style="color: #4A90E2; text-decoration: none;">Careers</a>
        </p>
        
        <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} Koovly Careers. All rights reserved.</p>
      </td>
    </tr>
  </table>
`;

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
    subject: 'Application Confirmation - Koovly Careers',
    html: `
      ${emailHeader}
        <h2 style="font-size: 18px; color: #333333; margin-bottom: 10px;">Dear ${fullName},</h2>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          Thank you for applying for the position of <strong>${jobTitle}</strong> with Koovly Careers. We have successfully received your application and are currently reviewing your qualifications.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          Our recruitment team will evaluate your application, and you will be contacted shortly regarding the next steps in the hiring process. Please monitor your inbox (and spam/junk folder) for further communications.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          We appreciate your interest in joining our team and look forward to the possibility of working with you.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5; margin-top: 20px;">
          Best regards,<br />
          The Koovly Recruitement Team
        </p>
      ${emailFooter}
    `,
  });
}

export async function sendDocumentUploadRequest(to: string, fullName: string, jobTitle: string, token: string) {
  const uploadLink = `${token}`;
  await transporter.sendMail({
    to,
    from: env.SMTP_FROM,
    subject: 'Request for Additional Documents - Koovly Careers',
    html: `
      ${emailHeader}
        <h2 style="font-size: 18px; color: #333333; margin-bottom: 10px;">Dear ${fullName},</h2>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> is progressing. To proceed further, we kindly request you to submit additional documents to support your application.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          Please use the following secure link to upload your documents:
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5; margin: 10px 0;">
          <a href="${uploadLink}" style="color: #4A90E2; text-decoration: none; font-weight: bold;">Upload Documents</a>
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5; margin: 10px 0;"> 
          if the link does not work, please copy and paste the following URL into your browser: <br />
          <a href="${uploadLink}" style="color: #4A90E2; text-decoration: none;">${uploadLink}</a>
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          Kindly ensure all required documents are uploaded 72 hours of recieving this email. Should you encounter any issues, please contact our recruitment team at <a href="mailto:careers@koovly.com" style="color: #4A90E2; text-decoration: none;">careers@koovly.com</a>.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5; margin-top: 20px;">
          Best regards,<br />
          The Koovly Recruitment Team
        </p>
      ${emailFooter}
    `,
  });
}

export async function sendDocumentAcknowledgment(to: string, fullName: string) {
  await transporter.sendMail({
    to,
    from: env.SMTP_FROM,
    subject: 'Acknowledgment of Document Submission - Koovly Careers',
    html: `
      ${emailHeader}
        <h2 style="font-size: 18px; color: #333333; margin-bottom: 10px;">Dear ${fullName},</h2>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          We are writing to confirm that we have successfully received the additional documents you submitted for your application with Koovly Careers.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          As the next step, we kindly request you to schedule a facial verification session. Please reply to this email or send us an email at <a href="mailto:careers@koovly.com" style="color: #4A90E2; text-decoration: none;">careers@koovly.com</a> with your preferred date and time for the verification, and our team will confirm your appointment.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5;">
          Should you have any questions or require assistance, please do not hesitate to contact us at <a href="mailto:careers@koovly.com" style="color: #4A90E2; text-decoration: none;">careers@koovly.com</a>.
        </p>
        <p style="font-size: 14px; color: #333333; line-height: 1.5; margin-top: 20px;">
          Best regards,<br />
          The Koovly Recruitment Team
        </p>
      ${emailFooter}
    `,
  });
}