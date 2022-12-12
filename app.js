import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import http from "http";

import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config";
import initializeWebSockets from './utils/websockets/websockets.js';

import authRoutes from './routes/auth-routes.js';
import usersRoutes from './routes/users-routes.js';
import trucksRoutes from './routes/trucks-routes.js';
import loadsRoutes from './routes/loads-router.js';
import loadReportsRoutes from './routes/load-reports-router.js';

const app = express();
const server = http.Server(app);

const { io, socket } = initializeWebSockets(server);

app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/uploads/files', express.static(path.join('uploads', 'files')));

app.use('/api/auth', authRoutes);
app.use('/api/users/me', usersRoutes);
app.use('/api/trucks', trucksRoutes);
app.use('/api/loads', loadsRoutes);
app.use('/api/reports', loadReportsRoutes);

// error handler middleware
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    res.status(error.code || 500);
    res.json({
        message: error.message || "An unknown error occured.",
    });
});

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nhtjl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);

    let db = mongoose.connection;
    db.on('error', (err) => console.log(err));
}

export { io, socket };
export default server.listen(process.env.PORT || 8080);