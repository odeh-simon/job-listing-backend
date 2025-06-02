import prisma from '../prisma';
import { NotFoundError } from '../utils/error.utils';

export async function getJobs(filters: { domain?: string; location?: string; locationType?: string }) {
  return prisma.job.findMany({
    where: {
      ...(filters.domain && { domain: { contains: filters.domain, mode: 'insensitive' } }),
      ...(filters.location && { location: { contains: filters.location, mode: 'insensitive' } }),
      ...(filters.locationType && { locationType: { equals: filters.locationType, mode: 'insensitive' } }),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getJobById(id: number) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { applications: true },
  });
  if (!job) throw new NotFoundError('Job not found');
  return job;
}

export async function createJob(data: {
  title: string;
  company: string;
  locationType: string;
  location: string;
  domain: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits?: string[];
  compensation?: string;
}) {
  return prisma.job.create({
    data: {
      ...data,
      responsibilities: data.responsibilities || [],
      qualifications: data.qualifications || [],
      benefits: data.benefits || [],
      compensation: data.compensation || null,
    },
  });
}

export async function updateJob(id: number, data: {
  title?: string;
  company?: string;
  locationType?: string;
  location?: string;
  domain?: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  compensation?: string | null;
}) {
  const job = await prisma.job.update({
    where: { id },
    data: {
      ...data,
    //   responsibilities: data.responsibilities || [],
    //   qualifications: data.qualifications || [],
    //   compensation: data.compensation || null,
    },
  });
  if (!job) throw new NotFoundError('Job not found');
  return job;
}

export async function deleteJob(id: number) {
  await prisma.job.delete({ where: { id } });
}