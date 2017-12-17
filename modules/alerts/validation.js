const Joi = require('joi');

module.exports = {
    alert: {
        params: {
        },
        body: {
            message: Joi.string().required(),
        },
    },
};
