import HttpError from "../models/http-error.js";

export default async (req, res, next) => {

    if (req.method === 'OPTIONS') {
        return next();
    }
    
    if (req.userData.role !== 'DRIVER') {
        return next(new HttpError('Only drivers can perform this action', 401));
    }

    next();
}