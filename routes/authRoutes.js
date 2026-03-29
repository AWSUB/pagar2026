const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/public', authController.registerPublic);
router.post('/register/school', authController.registerSchool);
router.post('/register/sppg', authController.registerSppg);
router.post('/login', authController.login);

module.exports = router;
