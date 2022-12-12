import HttpError from "../models/http-error.js";

export default async (req, res, next) => {

    if (req.method === 'OPTIONS') {
        return next();
    }
    
    if (req.userData.role !== 'SHIPPER') {
        return next(new HttpError('Only shippers can perform this action', 401));
    }

    next();
}