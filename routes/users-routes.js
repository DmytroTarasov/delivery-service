import { Router } from 'express';
import { getProfileInfo, changeProfilePassword, deleteProfile } from '../controllers/users-controller.js';
import checkAuth from '../middlewares/auth-middleware.js';
import { validateUserChangePassword } from "../models/user.js";
import joiValidator from "../middlewares/joi-validator-middleware.js";

const router = Router();

router.use(checkAuth);

router.get('/', getProfileInfo);

router.patch('/password', [joiValidator(validateUserChangePassword)], changeProfilePassword);

router.delete('/', deleteProfile);

export default router;