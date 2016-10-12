/**
 * Created by zeev on 2016/10/12 0012.
 */

var debug = require('debug')('zeev:user');
var handleError = require("../utils").handleError;
var User = global.dbHelper.getModel("User");

module.exports.adminRequired = function(req, res, next) {
    //	var user = req.session || req.session.user;
    var user = null,
        method = req.method;
    if (user) {
        debug("user", req.method);
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            return res.status(403).send({ msg: '用户权限不够' });
        }
        return res.redirect(303, '/signin');
    }
    next();
}

module.exports.signin = function(req, res) {
    var _user = {
        name: req.body.name,
        password: req.body.password
    }
    debug("signin", _user);
    User.findOne({ name: _user.name })
        .then(function(user) {
            if (user) {
                user.compare(_user, function(err, isMacth) {
                    if (isMacth && user.role >= 10) {
                        // req.session.user = user;
                        res.cookie('active', 'true');
                        res.cookie('name', user.name);
                        res.cookie('role', user.role);
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(403);
                    }
                })
            } else {
                res.sendStatus(403);
            }

        })
}
