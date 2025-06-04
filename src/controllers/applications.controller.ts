import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as applicationsService from '../services/applications.service';
import { ValidationError } from '../utils/error.utils';
import multer from 'multer';

const applicationSchema = z.object({
  body: z.object({
    jobId: z.number().int().positive(),
    firstName: z.string().min(1),
    middleName: z.string().optional(),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    phoneCountryCode: z.string().optional(),
    residentialAddress: z.object({
      streetName: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().min(1),
    }),
    expectedPay: z.string().optional(),
    dataAgreement: z.boolean(),
    countryOfBirth: z.string().optional(),
    highestEducationLevel: z.string().optional(),
    primarySpokenLanguage: z.string().optional(),
    additionalLanguage: z.string().optional(),
    availableHours: z.number().optional(),
    additionalInformation: z.string().optional(),
  }),
});

const applicationIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

const jobIdSchema = z.object({
  params: z.object({
    jobId: z.string().regex(/^\d+$/, 'Job ID must be a number'),
  }),
});

const uploadDocumentsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
  query: z.object({
    token: z.string().uuid(),
  }),
  body: z.object({
    ssnNumber: z.string().optional(),
  }).optional(),
});

// Middleware to handle Multer errors
function handleMulterError(err: any, req: Request, res: Response, next: Function) {
  if (err instanceof multer.MulterError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Multer error',
      message: err.message,
    });
  }
  if (err instanceof ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Validation error',
      message: err.message,
    });
  }
  next(err);
}

export async function createApplication(req: Request, res: Response) {
  try {
    const resumeFile = req.files && (req.files as any)['resume']?.[0];
    const documentFiles = req.files && (req.files as any)['documents'] || [];

    if (!resumeFile) {
      throw new ValidationError('Resume file is required');
    }

    const application = await applicationsService.createApplication(
      req.body,
      { buffer: resumeFile.buffer, mimetype: resumeFile.mimetype },
      documentFiles.map((file: any) => ({ buffer: file.buffer, mimetype: file.mimetype }))
    );
    res.status(StatusCodes.CREATED).json(application);
  } catch (err) {
    handleMulterError(err, req, res, () => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Server error',
        message: 'An unexpected error occurred',
      });
    });
  }
}

export async function getApplicationById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const application = await applicationsService.getApplicationById(id);
  res.status(StatusCodes.OK).json(application);
}

export async function getApplicationsByJobId(req: Request, res: Response) {
  const jobId = parseInt(req.params.jobId);
  const applications = await applicationsService.getApplicationsByJobId(jobId);
  res.status(StatusCodes.OK).json(applications);
}

export async function uploadDocuments(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const token = req.query.token as string;
    const documentFiles = req.files ? (req.files as Express.Multer.File[]) : [];
    const { ssnNumber } = req.body;

    if (!documentFiles.length) {
      throw new ValidationError('At least one document is required');
    }

    // Validate file types (redundant but kept for extra safety)
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    for (const file of documentFiles) {
      if (!allowedTypes.includes(file.mimetype)) {
        throw new ValidationError('Only PDF, PNG, JPEG, or JPG files are allowed');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new ValidationError('Each file must be under 5MB');
      }
    }

    if (documentFiles.length > 4) {
      throw new ValidationError('Maximum 4 documents allowed (2 for ID, 2 for SSN)');
    }

    const application = await applicationsService.uploadDocuments(
      id,
      token,
      documentFiles.map(file => ({ buffer: file.buffer, mimetype: file.mimetype })),
      ssnNumber
    );
    res.status(StatusCodes.OK).json(application);
  } catch (err) {
    handleMulterError(err, req, res, () => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Server error',
        message: 'An unexpected error occurred',
      });
    });
  }
}

export async function getAllApplications(req: Request, res: Response) {
  const applications = await applicationsService.getAllApplications();
  res.status(StatusCodes.OK).json(applications);
}

export const applicationSchemas = {
  createApplication: applicationSchema,
  getApplicationById: applicationIdSchema,
  getApplicationsByJobId: jobIdSchema,
  uploadDocuments: uploadDocumentsSchema,
  getAllApplications: z.object({}),
};