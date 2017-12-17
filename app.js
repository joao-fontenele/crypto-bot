const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const path = require('path');
const loggerMiddleware = require('./middleware/logger');
const authMiddleware = require('./middleware/basic-auth');

const env = process.env.NODE_ENV || 'development';
const modulesDir = path.join(__dirname, 'modules');

const app = express();

app.use(bodyParser.text({type: 'application/json'}));

// helmet handles various http headers to improve servers security
app.use(helmet());

app.use(authMiddleware);

if (env !== 'test') {
    app.use(loggerMiddleware);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// get and use all the routes from the routes dir
fs.readdirSync(modulesDir).forEach((module) => {
    const route = require(path.join(modulesDir, module, 'routes'));
    app.use(`/${module}`, route);
});

app.get('/hello', (req, res, next) => {
    res.status(200).send({message: 'hello world'});
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// joi validation error handler
app.use((err, req, res, next) => {
    if (err.isJoi) {
        const error = {
            statusCode: 400,
            statusText: 'Bad Request',
            location: err._meta.source,
            errors: [],
        };

        err.details.forEach((detail) => {
            error.errors.push({
                field: detail.path,
                message: detail.message,
                type: detail.type,
            });
        });

        return res.status(400).send(error);
    }

    return next(err);
});

// development error handler
// will print stacktrace
if (env === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500).send({
            error: {
                message: err.message,
                error: err,
            },
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            message: err.message,
        },
    });
});

module.exports = app;
