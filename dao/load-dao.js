import mongoose from 'mongoose';

import { Load } from "../models/load.js";
import { Truck } from "../models/truck.js";
import { Message } from "../models/message.js";
import HttpError from "../models/http-error.js";
import LOAD_STATES from "../models/load-states.js";

export default () => ({
    getUserLoads: (userId, role, status, limit = 10, offset = 0) => new Promise(async (resolve, reject) => {
        let predicate = role === 'DRIVER' ? { status, assigned_to: { $in: [userId, null] } } : { created_by: userId };

        let userLoads;

        try {
            userLoads = await Load.find(status ? { ...predicate, status } : predicate).skip(offset).limit(limit).select('-__v');
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve(userLoads);
    }),
    getDriverActiveLoad: (driverId) => new Promise(async (resolve, reject) => {
        let activeLoad;
        try {
            activeLoad = await Load.findOne({ assigned_to: driverId, status: { $nin: ['SHIPPED'] } }).select('-__v');
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve(activeLoad);
    }),
    getUserLoadById: (loadId) => new Promise(async (resolve, reject) => {
        let load;
        try {
            load = await Load.findById(loadId).select('-__v');
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve(load);
    }),
    updateShipperLoad: (loadData, loadId) => new Promise(async (resolve, reject) => {
        try {
            await Load.findByIdAndUpdate(loadId, { ...loadData });
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    }),
    deleteShipperLoad: (loadId) => new Promise(async (resolve, reject) => {
        try {
            await Load.findByIdAndDelete(loadId);
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    }),
    iterateToNextLoadState: (load, truck) => new Promise(async (resolve, reject) => {

        const currentIndexState = LOAD_STATES.indexOf(load.state);

        if (currentIndexState === LOAD_STATES.length - 1) {
            return reject(new HttpError('Load was already delivered', 400));
        }

        load.state = LOAD_STATES[currentIndexState + 1];
        load.logs.push({
            message: `Load state changed to ${load.state}`,
            time: new Date().toISOString()
        });

        if (currentIndexState === LOAD_STATES.length - 2) {
            load.status = 'SHIPPED';
            truck.status = 'IS';
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await load.save();
            await truck.save();
            await sess.commitTransaction();
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }

        return resolve();
    }),
    postShipperLoad: (loadId) => new Promise(async (resolve, reject) => {
        let availableTruck;
        let load;
        try {
            await Load.findByIdAndUpdate(loadId, { status: 'POSTED' });
            load = await Load.findById(loadId);
            availableTruck = await Truck.findOne({
                status: 'IS', assigned_to: { $nin: [null] },
                payload: { $gte: load.payload }, "dimensions.width": { $gte: load.dimensions.width },
                "dimensions.height": { $gte: load.dimensions.height }, "dimensions.length": { $gte: load.dimensions.length }
            });
        } catch (err) {
            return reject(err);
        }

        if (availableTruck === null) {
            return resolve(false);
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await Truck.updateOne({ _id: availableTruck._id }, { status: 'OL' }).session(sess);
            await Load.updateOne({ _id: loadId }, { $push: { logs: { message: `Load assigned to driver with id = ${availableTruck.assigned_to}`, time: new Date().toISOString() } }, assigned_to: availableTruck.assigned_to, status: 'ASSIGNED', state: LOAD_STATES[0] }).session(sess);
            await sess.commitTransaction();
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }

        return resolve(true);
    }),
    addMessageToTheLoad: (message, loadId, userId, role, createdDate) => new Promise(async (resolve, reject) => {
        let load;

        try {
            load = await Load.findById(loadId);
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }

        if (!load) {
            return reject(new HttpError('Could not find a load for the provided id', 404));
        }

        const newMessage = new Message({
            author: userId,
            role,
            text: message,
            created_date: createdDate
        });

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();

            await newMessage.save({ session: sess });
            load.messages.push(newMessage);
            await load.save({ session: sess });

            await sess.commitTransaction();
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }

        return resolve();
    }),
    getLoadDetailedInfo: (loadId) => new Promise(async (resolve, reject) => {
        let load;
        try {
            load = await Load.findById(loadId)
                .populate('assigned_to', 'email')
                .populate('created_by', 'email')
                .populate('messages')
                .select('-__v');
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve(load);
    }),
    saveLoad: (load) => new Promise(async (resolve, reject) => {
        try {
            await load.save();
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    })
});