const logger = require('../utils/logger');

module.exports = function loggerMiddleware (req, res, next) {
    logger.info({req}, 'req');
    res.on('finish', function onFinish (err) {
        if (res.statusCode < 500) {
            logger.info({res}, 'res');
        } else {
            logger.error({res}, 'res');
        }
    });
    next();
};
