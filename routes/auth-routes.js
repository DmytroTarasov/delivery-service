import { Router } from "express";
import { createProfile, login, forgotPassword } from "../controllers/auth-controller.js";
import { validateUserRegister, validateUserLogin, validateUserForgotPassword } from "../models/user.js";
import joiValidator from "../middlewares/joi-validator-middleware.js";
import fileUpload from '../middlewares/file-upload-middleware.js';

const router = Router();

router.post('/register', 
    [fileUpload.single('image'), joiValidator(validateUserRegister)], 
    createProfile);

router.post('/login', [joiValidator(validateUserLogin)], login);

router.post('/forgot_password', [joiValidator(validateUserForgotPassword)], forgotPassword);

export default router;