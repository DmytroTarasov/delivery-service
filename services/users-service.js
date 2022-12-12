import bcrypt from 'bcryptjs';

import HttpError from '../models/http-error.js';
import userDao from '../dao/user-dao.js';

export default () => ({
    getProfileInfo: (userId) => new Promise(async (resolve, reject) => {

        let user;
        try {
            user = await userDao().findUserById(userId);
        } catch (err) {
            return reject(err);
        }
    
        return resolve({
            _id: user._id,
            role: user.role,
            email: user.email,
            image: user.image,
            created_date: user.created_date
        });
    }),
    changeProfilePassword: (oldPassword, newPassword, userId) => new Promise(async (resolve, reject) => {

        let user;
        try {
            user = await userDao().findUserById(userId);
        } catch (err) {
            return reject(err);
        }
    
        let isValidPassword = false;
        try {
            isValidPassword = await bcrypt.compare(oldPassword, user.password);
        } catch (err) {
            return reject(new HttpError('Could not change the password, please try again later', 500));
        }
    
        if (!isValidPassword) {
            return reject(new HttpError('Invalid old password', 400));
        }
    
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        } catch (err) {
            return reject(new HttpError('Could not change the password, please try again later', 500));
        }
    
        user.password = hashedPassword;
    
        try {
            await userDao().saveUser(user);
        } catch (err) {
            return reject(err);
        }
    
        return resolve();
    }),
    deleteProfile: (userId, role) => new Promise(async (resolve, reject) => {
        try {
            await userDao().deleteUser(userId, role);
        } catch (err) {
            return reject(err);
        }

        return resolve();
    })
});

