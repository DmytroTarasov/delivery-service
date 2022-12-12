import loadReportsService from "../services/load-reports-service.js";

export const createLoadReports = async (req, res, next) => {
    const { userId, role } = req.userData;

    loadReportsService().generateReports(userId, role)
        .then(_ => res.status(200).json({
            message: 'Reports were created successfully'
        }))
        .catch(err => next(err));
}