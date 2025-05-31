import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import * as authService from '../services/auth.service';

const authSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await authService.registerAdmin(email, password);
  res.status(StatusCodes.CREATED).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await authService.loginAdmin(email, password);
  res.status(StatusCodes.OK).json(result);
}

export const authSchemas = {
  register: authSchema,
  login: authSchema,
};