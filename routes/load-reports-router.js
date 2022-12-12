import { Router } from "express";
import checkAuth from '../middlewares/auth-middleware.js';
import { createLoadReports } from '../controllers/load-reports-controller.js'; 

const router = Router();

router.use(checkAuth);

router.post('/', createLoadReports);

export default router;