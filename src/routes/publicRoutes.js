const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const publicValidator = require('../validators/publicValidator');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken, isPublic } = require('../middlewares/authMiddleware');

router.use(
    verifyToken, 
    isPublic
);

router.get('/profile', publicController.getProfile);
router.get('/sppg_list', publicController.getSppgList);
router.post('/reviews', 
    upload.array('attachments', 2),
    publicValidator.createReview, 
    validate, 
    publicController.createReview
);

router.get('/dashboard/reviews', publicController.getDashboardReviews);
router.get('/dashboard/sppg_reports', publicController.getDashboardSppgReports);
router.get('/dashboard/sppg_reports/:id_daily_report', 
    publicValidator.getDetailReport, 
    validate, 
    publicController.getDetailSppgReport
);

module.exports = router;
