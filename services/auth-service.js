import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generator from 'generate-password';
import { sendEmail } from '../utils/email/sendEmail.js';

import HttpError from '../models/http-error.js';
import { User } from '../models/user.js';
import userDao from '../dao/user-dao.js';

export default () => ({
    createProfile: (email, password, role, file) => new Promise(async (resolve, reject) => {
        try {
            await userDao().findUserByEmail(email, false);
        } catch (err) {
            return reject(err);
        }
    
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return reject(new HttpError('User was not created, try again later', 500));
        }
    
        const createdUser = new User({
            email,
            password: hashedPassword,
            role,
            image: file,
            created_date: new Date().toISOString()
        });
    
        try {
            await userDao().saveUser(createdUser);
        } catch (err) {
            return reject(err);
        }
    
        return resolve();
    }),
    login: (email, password) => new Promise(async (resolve, reject) => {
    
        let existingUser;
        try {
            existingUser = await userDao().findUserByEmail(email, true);
        } catch (err) {
            return reject(err);
        }
    
        let isValidPassword = false;
        try {
            isValidPassword = await bcrypt.compare(password, existingUser.password);
        } catch (err) {
            return reject(new HttpError('Could not log you in, please try later', 500));
        }
    
        if (!isValidPassword) {
            return reject(new HttpError('Invalid creds', 400));
        }
    
        let token;
        try {
            token = jwt.sign({ userId: existingUser.id, email: existingUser.email, role: existingUser.role }, process.env.JWT_KEY);
        } catch (err) {
            return reject(new HttpError('Login failed', 500));
        }
    
        return resolve(token);
    }),
    forgotPassword: (email) => new Promise(async (resolve, reject) => {
        const user = await User.findOne({ email });

        if (!user) {
            return reject(new HttpError(`User doesn't exist`, 400));
        }
    
        const newPassword = generator.generate({
            length: 10,
            numbers: true
        });

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        } catch (err) {
            return reject(new HttpError('Could not hash the new password', 500));
        }

        try {
            await User.findOneAndUpdate({ email }, { password: hashedPassword });
        } catch (err) {
            return reject(new HttpError('Password was not changed, try again later', 500));
        }
    
        try {
            await sendEmail(email, 'Password change', { password: newPassword }, 
            './utils/email/templates/requestChangePassword.handlebars');
        } catch (err) {
            return reject(err);
        }

        return resolve();

    }) 
});
