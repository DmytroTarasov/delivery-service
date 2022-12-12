import { Load } from '../models/load.js';
import HttpError from '../models/http-error.js';

import loadDao from '../dao/load-dao.js';
import truckDao from '../dao/truck-dao.js';

import { sendEmail } from '../utils/email/sendEmail.js';

export default () => ({
    addLoadForShipper: (load, shipperId) => new Promise(async (resolve, reject) => {
        const newLoad = new Load({
            ...load,
            created_by: shipperId,
            created_date: new Date().toISOString()
        });

        try {
            await loadDao().saveLoad(newLoad);
        } catch (err) {
            return reject(err);
        }
        return resolve();
    }),
    getDriverActiveLoad: (driverId) => new Promise(async (resolve, reject) => {
        let activeLoad;
        try {
            activeLoad = await loadDao().getDriverActiveLoad(driverId);
        } catch (err) {
            return reject(err);
        }
        return resolve(activeLoad);
    }),
    getUserLoads: (userId, role, status, limit, offset) => new Promise(async (resolve, reject) => {
        if (role === 'DRIVER' && !['ASSIGNED', 'SHIPPED'].includes(status)) {
            return reject(new HttpError('Driver cannot request loads with status NEW or POSTED', 400));
        }

        let loads;
        try {
            loads = await loadDao().getUserLoads(userId, role, status, limit, offset);
        } catch (err) {
            return reject(err);
        }
        return resolve(loads);
    }),
    iterateToNextLoadState: (driverId) => new Promise(async (resolve, reject) => {
        let load;
        let assignedTruck;

        try {
            load = await loadDao().getDriverActiveLoad(driverId);
            assignedTruck = await truckDao().getDriverAssignedTruck(driverId);
        } catch (err) {
            return reject(err);
        }

        if (!load) {
            return reject(new HttpError('You have no assigned load', 400));
        }

        try {
            await loadDao().iterateToNextLoadState(load, assignedTruck);
        } catch (err) {
            return reject(err);
        }

        // if (load.status === 'SHIPPED') {
        //     try {
        //         load = await loadDao().getLoadDetailedInfo(load._id);
        //         const { name, created_by, assigned_to } = load;
        //         await sendEmail(assigned_to.email, `Load '${name}'`, { 
        //             name, 
        //             email: created_by.email,
        //         }, 
        //         './utils/email/templates/shippedLoadDriver.handlebars');

        //         await sendEmail(created_by.email, `Load '${name}'`, { 
        //             name, 
        //             email: assigned_to.email 
        //         }, 
        //         './utils/email/templates/shippedLoadShipper.handlebars');
        //     } catch (err) {
        //         return reject(err);
        //     }
        // }

        return resolve(load);
    }),
    getUserLoadById: (loadId) => new Promise(async (resolve, reject) => {
        let load;

        try {
            load = await loadDao().getUserLoadById(loadId);
        } catch (err) {
            return reject(err);
        }
        return resolve(load);
    }),
    updateShipperLoad: (loadData, loadId) => new Promise(async (resolve, reject) => {
        try {
            await loadDao().updateShipperLoad(loadData, loadId);
        } catch (err) {
            return reject(err);
        }
        return resolve();
    }),
    deleteShipperLoad: (loadId) => new Promise(async (resolve, reject) => {
        try {
            await loadDao().deleteShipperLoad(loadId);
        } catch (err) {
            return reject(err);
        }
        return resolve();
    }),
    postShipperLoad: (loadId) => new Promise(async (resolve, reject) => {
        let truckFound;
        let load;
        try {
            truckFound = await loadDao().postShipperLoad(loadId);
        } catch (err) {
            return reject(err);
        }

        // if (truckFound) {
        //     try {
        //         load = await loadDao().getLoadDetailedInfo(loadId);
        //         const { name, payload, delivery_address, pickup_address, 
        //             dimensions, created_by, assigned_to } = load;
        //         const { width, height, length } = dimensions;
        //         await sendEmail(assigned_to.email, `Load '${name}'`, { 
        //             name, 
        //             email: created_by.email,
        //             payload,
        //             deliveryAddress: delivery_address,
        //             pickupAddress: pickup_address,
        //             width,
        //             height, 
        //             length
        //         }, 
        //         './utils/email/templates/assignedLoadDriver.handlebars');

        //         await sendEmail(created_by.email, `Load '${name}'`, { name, email: assigned_to.email }, 
        //         './utils/email/templates/assignedLoadShipper.handlebars');
        //     } catch (err) {
        //         return reject(err);
        //     }
        // }


        return resolve(truckFound);
    }),
    addMessageToTheLoad: (message, loadId, userId, role, createdDate) => new Promise(async (resolve, reject) => {
        try {
            await loadDao().addMessageToTheLoad(message, loadId, userId, role, createdDate);
        } catch (err) {
            return reject(err);
        }
        return resolve();
    }),
    getLoadDetailedInfo: (loadId) => new Promise(async (resolve, reject) => {
        let load;

        try {
            load = await loadDao().getLoadDetailedInfo(loadId);
        } catch (err) {
            return reject(err);
        }
        return resolve(load);
    })
});
