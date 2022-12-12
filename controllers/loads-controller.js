import loadsService from '../services/loads-service.js';
import { io, socket } from '../app.js';

export const addLoadForShipper = async (req, res, next) => {
    loadsService().addLoadForShipper(req.body, req.userData.userId)
        .then(_ => res.status(200).json({
            message: 'Load created successfully'
        }))
        .catch(err => next(err));
}

export const getDriverActiveLoad = async (req, res, next) => {
    loadsService().getDriverActiveLoad(req.userData.userId)
        .then(load => res.status(200).json({ load }))
        .catch(err => next(err));
}

export const getUserLoads = async (req, res, next) => {
    const { status, offset, limit } = req.query;
    const { userId, role } = req.userData;

    loadsService().getUserLoads(userId, role, status, limit, offset)
        .then(loads => res.status(200).json({ loads }))
        .catch(err => next(err));
}

export const iterateToNextLoadState = async (req, res, next) => {
    loadsService().iterateToNextLoadState(req.userData.userId)
        .then(load => {
            io.emit('loadIterateToNextState', { state: load.state, status: load.status, loadId: load._id });
            return res.status(200).json({ message: `Load state changed to '${load.state}'` })
        })
        .catch(err => next(err));
}

export const getUserLoad = async (req, res, next) => {
    loadsService().getUserLoadById(req.params.loadId)
        .then(load => res.status(200).json({ load }))
        .catch(err => next(err));
}

export const updateShipperLoad = async (req, res, next) => {
    loadsService().updateShipperLoad(req.body, req.params.loadId)
        .then(_ => res.status(200).json({ message: 'Load details changed successfully' }))
        .catch(err => next(err));
}

export const deleteShipperLoad = async (req, res, next) => {
    loadsService().deleteShipperLoad(req.params.loadId)
        .then(_ => res.status(200).json({ message: 'Load deleted successfully' }))
        .catch(err => next(err));
}

export const postShipperLoad = async (req, res, next) => {
    loadsService().postShipperLoad(req.params.loadId)
        .then(areAvailableTrucks => res.status(200).json({
            message: 'Load posted successfully',
            driver_found: areAvailableTrucks
        }))
        .catch(err => next(err));
}

export const getLoadDetailedInfo = async (req, res, next) => {
    loadsService().getLoadDetailedInfo(req.params.loadId)
        .then(load => res.status(200).json({ load }))
        .catch(err => next(err));
}