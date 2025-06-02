import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as jobsService from '../services/jobs.service';
import { ValidationError } from '../utils/error.utils';

const jobSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    locationType: z.string().min(1),
    location: z.string().min(1),
    domain: z.string().min(1),
    description: z.string().min(1),
    responsibilities: z.array(z.string()).optional(),
    qualifications: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    compensation: z.string().optional(),
  }),
});

const jobUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    company: z.string().min(1).optional(),
    locationType: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    domain: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    responsibilities: z.array(z.string()).optional(),
    qualifications: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    compensation: z.string().optional().nullable(),
  }),
});

const jobIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

const jobQuerySchema = z.object({
  query: z.object({
    domain: z.string().optional(),
    location: z.string().optional(),
    locationType: z.string().optional(),
  }),
});

export async function getJobs(req: Request, res: Response) {
  const filters = req.query as { domain?: string; location?: string; locationType?: string };
  const jobs = await jobsService.getJobs(filters);
  res.status(StatusCodes.OK).json(jobs);
}

export async function getJobById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const job = await jobsService.getJobById(id);
  res.status(StatusCodes.OK).json(job);
}

export async function createJob(req: Request, res: Response) {
  const job = await jobsService.createJob(req.body);
  res.status(StatusCodes.CREATED).json(job);
}

export async function updateJob(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const job = await jobsService.updateJob(id, req.body);
  res.status(StatusCodes.OK).json(job);
}

export async function deleteJob(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  await jobsService.deleteJob(id);
  res.status(StatusCodes.NO_CONTENT).send();
}

export const jobSchemas = {
  getJobs: jobQuerySchema,
  getJobById: jobIdSchema,
  createJob: jobSchema,
  updateJob: jobUpdateSchema,
  deleteJob: jobIdSchema,
};