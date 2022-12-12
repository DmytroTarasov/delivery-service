import { Router } from "express";
import { addTruckForDriver, getDriverTrucks, getDriverTruckById, assignTruckToDriver, updateDriverTruck, deleteDriverTruck } from "../controllers/trucks-controller.js";
import checkAuth from '../middlewares/auth-middleware.js';
import checkDriverRole from "../middlewares/driver-role-middleware.js";
import checkAssignedTruck from "../middlewares/assigned-truck-middleware.js";
import { validateTruckCreate } from "../models/truck.js";
import joiValidator from "../middlewares/joi-validator-middleware.js";

const router = Router();

router.use(checkAuth);

router.use(checkDriverRole);

router.post('/', [joiValidator(validateTruckCreate)], addTruckForDriver);

router.get('/', getDriverTrucks);

router.get('/:truckId', getDriverTruckById);

router.post('/:truckId/assign', assignTruckToDriver);

router.put('/:truckId', checkAssignedTruck, [joiValidator(validateTruckCreate)], updateDriverTruck);

router.delete('/:truckId', checkAssignedTruck, deleteDriverTruck);

export default router;