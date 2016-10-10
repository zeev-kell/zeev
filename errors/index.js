// # Errors
/*jslint regexp: true */
var _ = require('lodash'),
    NotFoundError = require('./not-found-error'),
    BadRequestError = require('./bad-request-error'),
    InternalServerError = require('./internal-server-error'),
    NoPermissionError = require('./no-permission-error'),
    MethodNotAllowedError = require('./method-not-allowed-error'),
    RequestEntityTooLargeError = require('./request-too-large-error'),
    UnauthorizedError = require('./unauthorized-error'),
    ValidationError = require('./validation-error'),
    UnsupportedMediaTypeError = require('./unsupported-media-type-error'),
    EmailError = require('./email-error'),
    DataImportError = require('./data-import-error'),
    TooManyRequestsError = require('./too-many-requests-error'),
    config,
    errors,

    // Paths for views
    userErrorTemplateExists = false;

// Shim right now to deal with circular dependencies.
// @TODO(hswolff): remove circular dependency and lazy require.
function getConfigModule() {
    if (!config) {
        config = require('../config');
    }

    return config;
}

/**
 * Basic error handling helpers
 */
errors = {
    updateActiveTheme: function(activeTheme) {
        userErrorTemplateExists = getConfigModule().paths.availableThemes[activeTheme].hasOwnProperty('error.hbs');
    },

    throwError: function(err) {
        if (!err) {
            err = new Error('An error occurred');
        }

        if (_.isString(err)) {
            throw new Error(err);
        }

        throw err;
    },

    renderErrorPage: function(code, err, req, res, next) {
        res.status(code || 500);
        res.render('error', {
            message: err,
            req: req
        });
    },

    error404: function(req, res, next) {
        var message = '页面未找到';

        // do not cache 404 error
        res.set({ 'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0' });
        if (req.method === 'GET') {
            var err = new Error('Not Found');
            err.status = 404;
            this.renderErrorPage(404, message, err, res, next);
        } else {
            res.status(404).send(message);
        }
    },

    error500: function(err, req, res, next) {
        // 500 errors should never be cached
        res.set({ 'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0' });

        if (err.status === 404 || err.code === 404) {
            return this.error404(req, res, next);
        }

        if (req.method === 'GET') {
            if (!err || !(err instanceof Error)) {
                next();
            }
            errors.renderErrorPage(err.status || err.code || 500, err, req, res, next);
        } else {
            var statusCode = 500,
                returnErrors = [];

            if (!_.isArray(err)) {
                err = [].concat(err);
            }

            _.each(err, function(errorItem) {
                var errorContent = {};

                statusCode = errorItem.code || 500;

                errorContent.message = _.isString(errorItem) ? errorItem :
                    (_.isObject(errorItem) ? errorItem.message : 'Unknown Error');
                errorContent.errorType = errorItem.errorType || 'InternalServerError';
                returnErrors.push(errorContent);
            });

            res.status(statusCode).json({ errors: returnErrors });
        }
    }
};

// Ensure our 'this' context for methods and preserve method arity by
// using Function#bind for expressjs
_.each([
    'error404',
    'error500'
], function(funcName) {
    errors[funcName] = errors[funcName].bind(errors);
});

module.exports = errors;
module.exports.NotFoundError = NotFoundError;
module.exports.BadRequestError = BadRequestError;
module.exports.InternalServerError = InternalServerError;
module.exports.NoPermissionError = NoPermissionError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ValidationError = ValidationError;
module.exports.RequestEntityTooLargeError = RequestEntityTooLargeError;
module.exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
module.exports.EmailError = EmailError;
module.exports.DataImportError = DataImportError;
module.exports.MethodNotAllowedError = MethodNotAllowedError;
module.exports.TooManyRequestsError = TooManyRequestsError;
