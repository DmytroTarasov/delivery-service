import mongoose from "mongoose";

import { MongoMemoryReplSet } from "mongodb-memory-server";

let replset = null;

export const connectDB = async () => {
    try {
        replset = await MongoMemoryReplSet.create();
        const uri = replset.getUri();
        mongoose.connect(uri);
    } catch (err) {
        console.log(err); 
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();

        if (mongod) {
            await mongod.stop();
        }
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}