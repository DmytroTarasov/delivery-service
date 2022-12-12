import mongoose from "mongoose";
import Joi from "joi";

const Schema = mongoose.Schema;

const truckSchema = new Schema({
    created_by: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    assigned_to: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    type: { type: String, required: true },
    status: { type: String, default: 'IS' },
    payload: { type: Number, required: true },
    dimensions: {
        width: { type: Number, required: true },
        length: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    created_date: { type: String, required: true }
});

const Truck = mongoose.model('Truck', truckSchema);

const validateTruckCreate = (truck) => {
    const schema = Joi.object({
        type: Joi.string().valid('SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT').required(),
    });
    return schema.validate(truck);
}

export { Truck, validateTruckCreate };

