import PDFGenerator from 'pdfkit';
import fs from 'fs';
import path from 'path';

import HttpError from '../models/http-error.js';

import loadsService from '../services/loads-service.js';

export default () => ({
    generateReports: (userId, role) => new Promise(async (resolve, reject) => {
        let theOutput = new PDFGenerator;

        try {
            theOutput.pipe(fs.createWriteStream(path.join('uploads', 'files', 'loadReports.pdf')));
        } catch (err) {
            return reject(new HttpError('File with load reports was not created', 500));
        }

        let loads;
        try {
            loads = await loadsService().getUserLoads(userId, role, 'SHIPPED');
        } catch (err) {
            return reject(err);
        }

        const tableTop = 50;
        const nameX = 50;
        const payloadX = 100;
        const pickupAddressX = 150;
        const deliveryAddressX = 250;
        const widthX = 350;
        const heightX = 390;
        const lengthX = 430;
        const createdDateX = 480;

        theOutput
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('Name', nameX, tableTop)
            .text('Payload', payloadX, tableTop)
            .text('Pickup Address', pickupAddressX, tableTop)
            .text('Delivery Address', deliveryAddressX, tableTop)
            .text('Width', widthX, tableTop)
            .text('Height', heightX, tableTop)
            .text('Length', lengthX, tableTop)
            .text('Date', createdDateX, tableTop)

        let i = 0;
        loads.forEach(item => {
            const y = tableTop + 25 + (i * 100);

            theOutput
                .font('Helvetica')
                .fontSize(10)
                .text(item.name, nameX, y)
                .text(item.payload, payloadX, y, { width: 35, align: 'right' })
                .text(item.pickup_address, pickupAddressX, y, { width: 90 })
                .text(item.delivery_address, deliveryAddressX, y, { width: 90 })
                .text(item.dimensions.width, widthX, y, { width: 30, align: 'right' })
                .text(item.dimensions.height, heightX, y, { width: 30, align: 'right' })
                .text(item.dimensions.length, lengthX, y, { width: 30, align: 'right' })
                .text(new Date(item.created_date).toLocaleDateString(), createdDateX, y);

                i++;
        });

        theOutput.end();
    
        return resolve();
    })
});
