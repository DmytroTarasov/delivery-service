import mongoose from "mongoose";
import Joi from "joi";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, default: null },
    created_date: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const validateUserRegister = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('SHIPPER', 'DRIVER').required()
    });
    return schema.validate(user);
}

const validateUserLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(user);
}

const validateUserChangePassword = (data) => {
    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

const validateUserForgotPassword = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    return schema.validate(data);
}

export { User, validateUserRegister, validateUserLogin, validateUserChangePassword,
    validateUserForgotPassword };