import { Router } from 'express';
import * as authController from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post('/register', validate(authController.authSchemas.register), authController.register);
router.post('/login', validate(authController.authSchemas.login), authController.login);

export default router;