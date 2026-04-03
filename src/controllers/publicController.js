const publicService = require('../service/publicService');

const getPaginationParams = (query, defaultLimit = 10) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || defaultLimit;
    const keyword = query.search || ''; 
    return { page, limit, keyword };
};

class PublicController {
    async getProfile(req, res, next) {
        try {
            const profile = await publicService.getProfile(req.user.id_user);
            
            return res.status(200).json({ 
                status: 'success', 
                data: profile 
            });
        } catch (error) {
            next(error);
        }
    }

    async getSppgList(req, res, next) {
        try {
            const sppgList = await publicService.getSppgList();
            
            return res.status(200).json({
                status: 'success',
                data: sppgList
            });
        } catch (error) {
            next(error);
        }
    }

    async createReview(req, res, next) {
        try {
            const id_user = req.user ? req.user.id_user : null; 
            
            const newReview = await publicService.createReview(id_user, req.body, req.files);
            
            return res.status(201).json({ 
                status: 'success', 
                data: newReview 
            });
        } catch (error) {
            next(error);
        }
    }

    async getDashboardReviews(req, res, next) {
        try {
            const { page, limit, keyword } = getPaginationParams(req.query, 15);
            const result = await publicService.getDashboardReviews(page, limit, keyword);
            
            return res.status(200).json({
                status: 'success',
                data: result.data || result, 
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    }

    async getDashboardSppgReports(req, res, next) {
        try {
            const { page, limit, keyword } = getPaginationParams(req.query, 15);
            const result = await publicService.getDashboardSppgReports(page, limit, keyword);
            
            return res.status(200).json({
                status: 'success',
                data: result.data || result,
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    }

    async getDetailSppgReport(req, res, next) {
        try {
            const { id_daily_report } = req.params; 
            
            const detailReport = await publicService.getDetailSppgReport(id_daily_report);
            
            return res.status(200).json({
                status: 'success',
                data: detailReport
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PublicController();
