const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/accounts/pending', 
    verifyToken, 
    isAdmin, 
    adminController.getPendingAccounts
);

router.get('/accounts/active', 
    verifyToken, 
    isAdmin, 
    adminController.getActiveAccounts
);

router.put('/accounts/:id_user/status', 
    verifyToken, 
    isAdmin, 
    adminController.updateAccountStatus
);

router.get('/dashboard', 
    verifyToken, 
    isAdmin, 
    adminController.getDashboardData
);

router.put('/reviews/:id_review/status', 
    verifyToken, 
    isAdmin, 
    adminController.updateReviewStatus
);

module.exports = router;
