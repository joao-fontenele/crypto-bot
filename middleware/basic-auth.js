const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();
const users = {};


if (!process.env.API_USER || !process.env.API_PASSWORD) {
    throw new Error('basic-auth middleware: expected API_USER and ' +
            'API_PASSWORD from environment');
}

users[process.env.API_USER] = process.env.API_PASSWORD;

function isAuthorized (username, password, cb) {
    if (users[username] && users[username] === password) {
        return cb(null, true);
    }
    return cb(null, false);
}

app.use(basicAuth({
    authorizeAsync: true,
    authorizer: isAuthorized,
    unauthorizedResponse: {message: 'access denied'},
}));

module.exports = app;
