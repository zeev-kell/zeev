/**
 * Created by zeev on 2016/11/6 0006.
 */

var _ = require('lodash'),
    errors = require("../errors");

exports.comment = require('./comment');
exports.visitor = require('./visitor');
exports.post = require('./post');
exports.tag = require('./tag');

exports.http = function(method) {
    return function handler(req, res, next) {
        var object = req.body,
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
                return res.json(response || {});
            }).catch(function onAPIError(error) {
                // To be handled by the API middleware
                next(error);
            });
    };
};

exports._http = function(method) {
    return function handler(req, res, next) {
        var object = req.body,
            options = _.extend({}, req.files, req.query, req.params, {
                context: {
                    _v: (req.cookies && req.cookies._v) ? req.cookies._v : null
                }
            });

        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        return method(object, options)
            .tap(function onSuccess(response) {
                next();
            })
            .catch(errors.handleCatchError(req, res, next));
    };
};
