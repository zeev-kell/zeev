/**
 * Created by zeev on 2016/11/6 0006.
 */
var debug  = require('debug')('zeev:middleware'),
    _      = require('lodash'),
    errors = require("../errors");
exports.authenticateClient = function (req, res, next) {
    var session = req.session;
    var method = req.method;
    if (!session.user) {
        debug("no signin user", req.method);
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            return errors.handleAPIError(new errors.UnauthorizedError('未登录...'), req, res, next);
        }
        return res.redirect(303, '/signin');
    }
    debug("signin user : ", session.user.name);
    next();
}

exports.http = function (method) {
    return function handler(req, res, next) {
        var object  = req.body,
            options = _.extend({}, req.files, req.query, req.params, {
                context: {
                    user: (req.user && req.user.id) ? req.user.id : null
                }
            });

        /**
         * PUT , POST, or PATCH , req.body is an object
         * GET or DELETE req.body should be null
         */
        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        return method(object, options)
            .tap(function onSuccess(response) {
                // Add X-Cache-Invalidate, Location, and Content-Disposition headers
                return addHeaders(method, req, res, (response || {}));
            }).then(function then(response) {
                // Send a properly formatting HTTP response containing the data with correct headers
                res.json(response || {});
            }).catch(function onAPIError(error) {
                // To be handled by the API middleware
                next(error);
            });
    };
};

function addHeaders(method, req, res, response) {
    return;
}