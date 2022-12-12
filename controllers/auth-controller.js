import authService from '../services/auth-service.js';

export const createProfile = async (req, res, next) => {
    const { email, password, role } = req.body;

    authService().createProfile(email, password, role, req?.file?.path)
        .then(_ => res.status(200).json({
            message: 'Profile created successfully'
        }))
        .catch(err => next(err));
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    authService().login(email, password)
        .then(token => res.status(200).json({ jwt_token: token }))
        .catch(err => next(err));
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    authService().forgotPassword(email)
        .then(_ => res.status(200).json({
            message: 'New password sent to your email address'
        }))
        .catch(err => next(err));
}