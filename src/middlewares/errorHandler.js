const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = null;

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
        errors = err.errors.map(e => e.message);
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again.';
    }

    if (err.name === 'MulterError') {
        statusCode = 400;
        message = `Upload error: ${err.message}`;
    }

    if (statusCode === 500) {
        console.error('[CRITICAL SERVER ERROR]:', err);
    }

    const errorResponse = {
        status: 'error',
        message: message
    };

    if (errors) errorResponse.errors = errors;

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
