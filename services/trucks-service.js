import HttpError from '../models/http-error.js';
import { Truck } from '../models/truck.js';

import truckDao from '../dao/truck-dao.js';

import TRUCK_TYPES from '../models/truck-types.js';

export default () => ({
    addTruckForDriver: (type, driverId) => new Promise(async (resolve, reject) => {
        const truckType = TRUCK_TYPES.get(type);

        const newTruck = new Truck({
            created_by: driverId,
            type: type.toUpperCase(),
            payload: truckType.payload,
            dimensions: { ...truckType.dimensions },
            created_date: new Date().toISOString()
        });

        try {
            await truckDao().saveTruck(newTruck);
        } catch (err) {
            return reject(err);
        }

        return resolve();
    }),
    getDriverTrucks: (driverId) => new Promise(async (resolve, reject) => {

        let driverTrucks;
        try {
            driverTrucks = await truckDao().getDriverTrucks(driverId);
        } catch (err) {
            return reject(err);
        }

        return resolve(driverTrucks);
    }),
    getDriverTruckById: (truckId) => new Promise(async (resolve, reject) => {

        let truck;
        try {
            truck = await truckDao().getDriverTruckById(truckId);
        } catch (err) {
            return reject(err);
        }

        return resolve(truck);
    }),
    assignTruckToDriver: (truckId, driverId) => new Promise(async (resolve, reject) => {
        let driverAssignedTruck;
        try {
            driverAssignedTruck = await truckDao().getDriverAssignedTruck(driverId);
        } catch (err) {
            return reject(err);
        }

        if (driverAssignedTruck && driverAssignedTruck.status === 'OL') {
            return reject(new HttpError('You cannot reassign a truck when you are on load', 400));
        }

        if (driverAssignedTruck) {
            try {
                driverAssignedTruck.assigned_to = null;
                driverAssignedTruck.save();
            } catch (err) {
                return reject(new HttpError('Cannot reassign a truck, try again later', 500));
            }
        }

        try {
            await truckDao().assignTruckToDriver(truckId, driverId);
        } catch (err) {
            return reject(err);
        }

        return resolve({ assignedBefore: !!driverAssignedTruck, assignedBeforeTruckId: driverAssignedTruck?._id });
    }),
    updateDriverTruck: (truckId, type) => new Promise(async (resolve, reject) => {

        try {
            await truckDao().updateDriverTruck(truckId, type);
        } catch (err) {
            return reject(err);
        }

        return resolve();
    }),
    deleteDriverTruck: (truckId) => new Promise(async (resolve, reject) => {

        try {
            await truckDao().deleteDriverTruck(truckId);
        } catch (err) {
            return reject(err);
        }

        return resolve();
    })
});
