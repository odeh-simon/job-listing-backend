import { Router } from 'express';
import jobsRoutes from './v1/jobs.routes';
import applicationsRoutes from './v1/applications.routes';
import authRoutes from './v1/auth.routes';

const router = Router();

router.use('/v1/jobs', jobsRoutes);
router.use('/v1/applications', applicationsRoutes);
router.use('/v1/auth', authRoutes);

export default router;