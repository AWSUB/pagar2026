const { body, param, query } = require('express-validator');

const sppgValidator = {
    paginationOnly: [
        query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive number'),
        query('limit').optional().isInt({ min: 1 }).toInt().withMessage('Limit must be a positive number')
    ],

    getPeriodic: [
        query('start_date').notEmpty().isISO8601().withMessage('start_date menggunakan format (YYYY-MM-DD)'),
        query('end_date').notEmpty().isISO8601().withMessage('end_date tidak boleh kosong (YYYY-MM-DD)'),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1 }).toInt()
    ],

    createDailyReport: [
        body('date_report').notEmpty().isISO8601().withMessage('date_report tidak boleh kosong'),
        body('menu_name').notEmpty().isString().withMessage('Menu name tidak boleh kosong'),
        body('meal_time').notEmpty().isString().withMessage('Meal time tidak boleh kosong'),
        body('total_portion').notEmpty().isInt({ min: 1 }).withMessage('Portion tidak boleh kosong'),
        body('description')
            .notEmpty().withMessage('Deskripsi laporan tidak boleh kosong')
            .isString().withMessage('Deskripsi harus berupa teks')
            .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter'),
        body('energy').notEmpty().isNumeric(),
        body('protein').notEmpty().isNumeric(),
        body('fat').notEmpty().isNumeric(),
        body('carbohydrate').notEmpty().isNumeric(),
        body('budgets')
            .notEmpty().withMessage('Budgets detail tidak boleh kosong')
            .custom((value) => {
                try {
                    const data = typeof value === 'string' ? JSON.parse(value) : value;
                    if (!Array.isArray(data) || data.length === 0) {
                        throw new Error('Budgets must be a non-empty array');
                    }
                    if (!data[0].item_name || !data[0].item_price) {
                        throw new Error('Each budget item must have item_name and item_price');
                    }
                    return true;
                } catch (e) {
                    throw new Error(e.message || 'Invalid JSON format for budgets');
                }
            })
    ],

    updateBudget: [
        body('monthly_budget').notEmpty().isNumeric().withMessage('Monthly budget tidak boleh kosong (angka)')
    ],

    checkUUID: [
        param('id_daily_report').isUUID().withMessage('ID must be a valid UUID')
    ]
};

module.exports = sppgValidator;
