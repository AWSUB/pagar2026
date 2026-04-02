const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const validate = require('../middlewares/validate');

router.post(
    '/register/public', 
    authValidator.registerPublic,
    validate,
    authController.registerPublic
);

router.post(
    '/register/school', 
    authValidator.registerSchool, 
    validate, 
    authController.registerSchool
);

router.post(
    '/register/sppg', 
    authValidator.registerSppg, 
    validate, 
    authController.registerSppg
);

router.post(
    '/login', 
    authValidator.login, 
    validate, 
    authController.login
);

router.post('/forgot_password', authController.forgotPassword);
router.post('/reset_password/:token', authController.resetPassword);

module.exports = router;
