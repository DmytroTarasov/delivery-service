import { Router } from "express";
import { addLoadForShipper, getDriverActiveLoad, getUserLoads, iterateToNextLoadState, getUserLoad, updateShipperLoad, deleteShipperLoad, postShipperLoad, getLoadDetailedInfo } from "../controllers/loads-controller.js";
import checkAuth from '../middlewares/auth-middleware.js';
import checkDriverRole from "../middlewares/driver-role-middleware.js";
import checkShipperRole from "../middlewares/shipper-role-middleware.js";

import { validateLoadCreate } from "../models/load.js";
import joiValidator from "../middlewares/joi-validator-middleware.js";

const router = Router();

router.use(checkAuth);

router.post('/', checkShipperRole, [joiValidator(validateLoadCreate)], addLoadForShipper);

router.get('/', getUserLoads);

router.get('/active', checkDriverRole, getDriverActiveLoad);

router.patch('/active/state', checkDriverRole, iterateToNextLoadState);

router.get('/:loadId', getUserLoad);

router.put('/:loadId', checkShipperRole, [joiValidator(validateLoadCreate)], updateShipperLoad);

router.delete('/:loadId', checkShipperRole, deleteShipperLoad);

router.post('/:loadId/post', checkShipperRole, postShipperLoad);

router.get('/:loadId/shipping_info', getLoadDetailedInfo)

export default router;