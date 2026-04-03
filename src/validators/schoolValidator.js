const { body, query, param } = require('express-validator');

const schoolValidator = {
    checkPagination: [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('Page must be a number minimum 1'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('Limit must be a number between 1 - 100')
    ],

    updateProfile: [
        body('school_name')
            .notEmpty().withMessage('School Name is required')
            .isString().withMessage('School Name must be a string')
            .trim(),
        body('school_address')
            .notEmpty().withMessage('School Address is required')
            .isString().withMessage('School Address must be a string')
            .trim()
    ],

    createReview: [
        body('id_sppg')
            .notEmpty().withMessage('SPPG ID is required')
            .isUUID().withMessage('SPPG ID must be a valid UUID format'),
        body('title')
            .notEmpty().withMessage('Title is required')
            .isString().withMessage('Title must be a string')
            .isLength({ max: 255 }).withMessage('Title must be less than 255 characters long')
            .trim(),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isString().withMessage('Description must be a string')
            .trim(),
        body('rating_score')
            .notEmpty().withMessage('Rating is required')
            .isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 - 5')
    ],

    getDetailReport: [
        param('id_daily_report')
            .notEmpty().withMessage('Daily Report ID is required')
            .isUUID().withMessage('Daily Report ID must be a valid UUID format')
    ],
};

module.exports = schoolValidator;
