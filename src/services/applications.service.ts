import prisma from '../prisma';
import { uploadFile } from '../utils/cloudinary.utils';
import { sendApplicationConfirmation, sendDocumentUploadRequest, sendDocumentAcknowledgment } from '../utils/emails.utils';
import { NotFoundError, ValidationError } from '../utils/error.utils';
import { v4 as uuidv4 } from 'uuid';
import env from '../utils/env.utils';

interface Address {
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FileData {
  buffer: Buffer;
  mimetype: string;
}

export async function createApplication(
  data: {
    jobId: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneCountryCode?: string;
    residentialAddress: Address;
    expectedPay?: string;
    dataAgreement: boolean;
    countryOfBirth?: string;
    highestEducationLevel?: string;
    primarySpokenLanguage?: string;
    additionalLanguage?: string;
    availableHours?: number;
    additionalInformation?: string;
  },
  resumeFile: FileData,
  documentFiles: FileData[] = []
) {
  // Verify job exists
  const job = await prisma.job.findUnique({ where: { id: data.jobId } });
  if (!job) throw new NotFoundError('Job not found');

  // Upload resume
  const resumeUrl = await uploadFile(resumeFile.buffer, resumeFile.mimetype);

  // Upload documents
  const documentUrls = await Promise.all(
    documentFiles.map(file => uploadFile(file.buffer, file.mimetype))
  );

  // Generate unique token for document upload link
  const token = uuidv4();

  // Create application
  const application = await prisma.application.create({
    data: {
      jobId: data.jobId,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      phoneCountryCode: data.phoneCountryCode,
      resumeUrl,
      residentialAddress: JSON.stringify(data.residentialAddress),
      expectedPay: data.expectedPay,
      dataAgreement: data.dataAgreement,
      documentUrls,
      token,
      countryOfBirth: data.countryOfBirth,
      highestEducationLevel: data.highestEducationLevel,
      primarySpokenLanguage: data.primarySpokenLanguage,
      additionalLanguage: data.additionalLanguage,
      availableHours: data.availableHours,
      additionalInformation: data.additionalInformation,
    },
  });

  // Send confirmation email
  const fullName = `${data.firstName} ${data.lastName}`;
  await sendApplicationConfirmation(data.email, fullName, job.title);

  // Schedule follow-up email after 20 minutes
  setTimeout(async () => {
    const frontendBaseUrl = env.FRONTEND_BASE_URL;
    const uploadLink = `${frontendBaseUrl}/document-upload?appId=${application.id}&token=${token}`;
    await sendDocumentUploadRequest(data.email, fullName, job.title, uploadLink);
  }, 3000); // 20 minutes

  return application;
}

export async function getApplicationById(id: number) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) throw new NotFoundError('Application not found');
  return application;
}

export async function getApplicationsByJobId(jobId: number) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new NotFoundError('Job not found');
  return prisma.application.findMany({
    where: { jobId },
    include: { job: true },
  });
}

export async function uploadDocuments(id: number, token: string, documentFiles: FileData[]) {
  const application = await prisma.application.findUnique({
    where: { id, token },
  });
  if (!application) throw new NotFoundError('Application not found or invalid token');

  // Upload new documents
  const newDocumentUrls = await Promise.all(
    documentFiles.map(file => uploadFile(file.buffer, file.mimetype))
  );

  // Update application with new document URLs
  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      documentUrls: [...application.documentUrls, ...newDocumentUrls],
    },
  });

  // Send acknowledgment email
  const fullName = `${application.firstName} ${application.lastName}`;
  await sendDocumentAcknowledgment(application.email, fullName);

  return updatedApplication;
}

export async function getAllApplications() {
  return prisma.application.findMany({
    include: {
      job: {
        select: { id: true, title: true },
      },
    },
  });
}
