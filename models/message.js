import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    role: { type: String, required: true },
    text: { type: String, required: true },
    created_date: { type: String, required: true }
});

const Message = mongoose.model('Message', messageSchema);

export { Message };