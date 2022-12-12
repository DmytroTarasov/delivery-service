import { Truck } from "../models/truck.js";
import HttpError from "../models/http-error.js";

export default () => ({
    getDriverTrucks: (driverId) => new Promise(async (resolve, reject) => {
        let driverTrucks;
        try {
            driverTrucks = await Truck.find({ created_by: driverId }).select('-__v');
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve(driverTrucks);
    }),
    getDriverTruckById: (truckId) => new Promise(async (resolve, reject) => {
        let truck;
        try {
            truck = await Truck.findById(truckId).select('-__v');
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve(truck);
    }),
    getDriverAssignedTruck: (driverId) => new Promise(async (resolve, reject) => {
        let assignedTruck;
        try {
            assignedTruck = await Truck.findOne({ assigned_to: driverId });
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve(assignedTruck);
    }),
    assignTruckToDriver: (truckId, driverId) => new Promise(async (resolve, reject) => {
        try {
            await Truck.findByIdAndUpdate(truckId, { assigned_to: driverId });
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    }),
    updateDriverTruck: (truckId, newType) => new Promise(async (resolve, reject) => {
        try {
            await Truck.findByIdAndUpdate(truckId, { type: newType });
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    }),
    deleteDriverTruck: (truckId) => new Promise(async (resolve, reject) => {
        try {
            await Truck.findByIdAndRemove(truckId);
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    }),
    saveTruck: (truck) => new Promise(async (resolve, reject) => {
        try {
            await truck.save();
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    })
});