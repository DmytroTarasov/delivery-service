import trucksService from '../services/trucks-service.js';
import { io, socket } from '../app.js';

export const addTruckForDriver = async (req, res, next) => {
    trucksService().addTruckForDriver(req.body.type, req.userData.userId)
        .then(_ => res.status(200).json({
            message: 'Truck created successfully'
        }))
        .catch(err => next(err));
}

export const getDriverTrucks = async (req, res, next) => {

    trucksService().getDriverTrucks(req.userData.userId)
        .then(trucks => res.status(200).json({ trucks }))
        .catch(err => next(err));
}

export const getDriverTruckById = async (req, res, next) => {
    trucksService().getDriverTruckById(req.params.truckId)
        .then(truck => res.status(200).json({ truck }))
        .catch(err => next(err));
}

export const assignTruckToDriver = async (req, res, next) => {
    trucksService().assignTruckToDriver(req.params.truckId, req.userData.userId)
        .then(data => {
            io.emit('assignNewTruckToDriver', { truckId: req.params.truckId, ...data });
            return res.status(200).json({
            message: 'Truck assigned successfully'
        })})
        .catch(err => next(err));
}

export const updateDriverTruck = async (req, res, next) => {
    trucksService().updateDriverTruck(req.params.truckId, req.body.type)
        .then(_ => res.status(200).json({
            message: 'Truck details changed successfully'
        }))
        .catch(err => next(err));
}


export const deleteDriverTruck = async (req, res, next) => {
    trucksService().deleteDriverTruck(req.params.truckId)
        .then(_ => res.status(200).json({
            message: 'Truck deleted successfully'
        }))
        .catch(err => next(err));
}




