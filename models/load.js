import mongoose from "mongoose";
import Joi from "joi";

const Schema = mongoose.Schema;

const loadSchema = new Schema({
    created_by: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    assigned_to: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, default: 'NEW' },
    state: { type: String, default: null },
    name: { type: String, required: true },
    payload: { type: Number, required: true },
    pickup_address: { type: String, required: true },
    delivery_address: { type: String, required: true },
    dimensions: {
        width: { type: Number, required: true },
        length: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    logs: { type: [{ message: { type: String, required: true }, time: { type: String, required: true }, _id: false }], 
        default: []},
    messages: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Message' }],
    created_date: { type: String, required: true }
});

const Load = mongoose.model('Load', loadSchema);

const validateLoadCreate = (load) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        payload: Joi.number().required(),
        pickup_address: Joi.string().required(),
        delivery_address: Joi.string().required(),
        dimensions: Joi.object({
            width: Joi.number().required(),
            height: Joi.number().required(),
            length: Joi.number().required()
        })
    });
    return schema.validate(load);
}

export { Load, validateLoadCreate };