import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

import HttpError from '../../models/http-error.js';

const __dirname = path.resolve(path.dirname(''));

export const sendEmail = (email, subject, payload, template) => new Promise((resolve, reject) => {

    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'A7u9klEPq2@gmail.com',
                pass: 'rvwepmkgckbcgeas'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
        const compiledTemplate = handlebars.compile(source);

        const options = {
            from: 'A7u9klEPq2@gmail.com',
            to: email,
            subject: subject,
            html: compiledTemplate(payload)
        };

        transporter.sendMail(options, (error, info) => {
            if (error) {
                return reject(new HttpError('Email was not sent', 500));
            }

            return resolve();
        });

    } catch (err) {
        return reject(new HttpError('Problem with sending an email', 500));
    }
})