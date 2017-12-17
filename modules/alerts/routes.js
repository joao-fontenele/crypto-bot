const express = require('express');
const {celebrate} = require('celebrate');
const validation = require('./validation');
const request = require('axios');
const logger = require('../../utils/logger');

const router = express.Router();
const {BOT_HOST, BOT_TOKEN, GROUP_ID} = process.env;
const BOT_BASE_URL = `${BOT_HOST}/bot${BOT_TOKEN}`;


router.post('/v1/telegram', celebrate(validation.alert), function(req, res, next) {
    const {message} = req.body;
    request({
        url: `${BOT_BASE_URL}/sendMessage`,
        method: 'POST',
        data: {
            text: message,
            chat_id: GROUP_ID,
        },
    }).then(function(resp) {
        logger.info('alerts: sent message to telegram group');
        res.sendStatus(200);
    }).catch(function(err) {
        logger.error('alerts: failed to send message to telegram group', {err});
        res.send(500).json(err);
    });
});

module.exports = router;
