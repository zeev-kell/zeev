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
    debug("signin user : ", session.user.name ||　session.user　|| session);
    next();
}