import HttpError from "../models/http-error.js";

import truckDao from "../dao/truck-dao.js";

export default async (req, res, next) => {

    const truckId = req.params.truckId;

    let truck;
    try {
        truck = await truckDao().getDriverTruckById(truckId);
    } catch (err) {
        return next(new HttpError('DB error occured', 500));
    }
    
    if (truck.assigned_to !== null) {
        return next(new HttpError(`You cannot ${req.method === 'PUT' ? 'update' : 'delete'} this truck because it's assigned to you`, 400));
    }

    next();
}