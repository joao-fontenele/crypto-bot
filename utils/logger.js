const bunyan = require('bunyan');
const uuid = require('uuid');

const APP_NAME = 'trade-api';

function reqSerializer (req) {
    req.reqId = uuid.v4();
    return {
        reqId: req.reqId,
        method: req.method,
        url: req.url,
        // headers: req.headers, // too much info, whats important here? TODO
        userAgent: req.headers['user-agent'],
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort,
    };
}

function resSerializer (res) {
    return {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        reqId: res.req.reqId,
        header: res._header,
    };
}

const logger = bunyan.createLogger({
    name: APP_NAME,
    serializers: {
        req: reqSerializer,
        res: resSerializer,
        err: bunyan.stdSerializers.err,
    },
    streams: [
        {path: `./${APP_NAME}.log`},
        {stream: process.stdout},
    ],
});

module.exports = logger;
