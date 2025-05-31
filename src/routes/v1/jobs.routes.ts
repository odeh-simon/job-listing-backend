import { Router } from 'express';
import * as jobsController from '../../controllers/jobs.controller';
import { validate } from '../../middlewares/validate.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', validate(jobsController.jobSchemas.getJobs), jobsController.getJobs);
router.get('/:id', validate(jobsController.jobSchemas.getJobById), jobsController.getJobById);
router.post('/', requireAuth, validate(jobsController.jobSchemas.createJob), jobsController.createJob);
router.put('/:id', requireAuth, validate(jobsController.jobSchemas.updateJob), jobsController.updateJob);
router.delete('/:id', requireAuth, validate(jobsController.jobSchemas.deleteJob), jobsController.deleteJob);

export default router;