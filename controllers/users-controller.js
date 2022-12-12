import usersService from '../services/users-service.js';

export const getProfileInfo = async (req, res, next) => {
    usersService().getProfileInfo(req.userData.userId)
        .then(user => res.status(200).json({ user }))
        .catch(err => next(err));
}

export const changeProfilePassword = async (req, res, next) => {
    usersService().changeProfilePassword(req.body.oldPassword, req.body.newPassword, req.userData.userId)
        .then(_ => res.status(200).json({ message: 'Password changed successfully' }))
        .catch(err => next(err));
}

export const deleteProfile = async (req, res, next) => {    
    usersService().deleteProfile(req.userData.userId, req.userData.role)
        .then(_ => res.status(200).json({ message: 'Profile deleted successfully' }))
        .catch(err => next(err));
}   