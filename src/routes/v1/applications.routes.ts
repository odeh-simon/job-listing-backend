import { Router } from 'express';
import * as applicationsController from '../../controllers/applications.controller';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../utils/multer.utils';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'documents', maxCount: 4 }]),
  validate(applicationsController.applicationSchemas.createApplication),
  applicationsController.createApplication
);
router.get(
  '/:id',
  requireAuth,
  validate(applicationsController.applicationSchemas.getApplicationById),
  applicationsController.getApplicationById
);
router.get(
  '/job/:jobId',
  requireAuth,
  validate(applicationsController.applicationSchemas.getApplicationsByJobId),
  applicationsController.getApplicationsByJobId
);
router.put(
  '/:id/documents',
  upload.array('documents', 4),
  validate(applicationsController.applicationSchemas.uploadDocuments),
  applicationsController.uploadDocuments
);
router.get(
  '/',
  requireAuth,
  validate(applicationsController.applicationSchemas.getAllApplications),
  applicationsController.getAllApplications
);

export default router;