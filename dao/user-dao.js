import mongoose from 'mongoose';

import { User } from "../models/user.js";
import { Truck } from "../models/truck.js";
import { Load } from "../models/load.js";
import HttpError from "../models/http-error.js";

import truckDao from "./truck-dao.js";
import loadDao from './load-dao.js';

export default () => ({
    findUserByEmail: (email, loginMode) => new Promise(async (resolve, reject) => {
        let existingUser;

        try {
            existingUser = await User.findOne({ email });
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }

        if (loginMode) {
            if (!existingUser) {
                return reject(new HttpError('Invalid creds', 400));
            }
        } else {
            if (existingUser) {
                return reject(new HttpError('User exists already, please login instead', 422));
            }
        }

        return resolve(existingUser);
    }),
    findUserById: (userId) => new Promise(async (resolve, reject) => {
        let user;

        try {
            user = await User.findById(userId).select('-__v');
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }

        if (!user) {
            return reject('User doesn`t exist', 500);
        }

        return resolve(user);
    }),
    deleteUser: (userId, role) => new Promise(async (resolve, reject) => {
        if (role === 'DRIVER') {
            let driverTrucks;
            try {
                driverTrucks = await truckDao().getDriverTrucks(userId);
                if (driverTrucks.filter(truck => truck.status === 'OL').length > 0) {
                    return reject(new HttpError('You cannot delete a profile when you are on load', 400));
                }
                const sess = await mongoose.startSession();
                sess.startTransaction();
                await Truck.deleteMany({ created_by: userId }).session(sess);
                await User.findByIdAndRemove(userId).session(sess);
                await sess.commitTransaction();
            } catch (err) {
                return reject(new HttpError('DB error occured', 500));
            }
        } else {
            try {
                const sess = await mongoose.startSession();
                sess.startTransaction();
                await Load.deleteMany({ created_by: userId, state: null }).session(sess);
                await User.findByIdAndRemove(userId).session(sess);
                await sess.commitTransaction();
            } catch (err) {
                return reject(new HttpError('DB error occured', 500));
            }
        }

        return resolve();
    }),
    saveUser: (user) => new Promise(async (resolve, reject) => {
        try {
            await user.save();
        } catch (err) {
            return reject(new HttpError('DB error occured', 500));
        }
        return resolve();
    })
});