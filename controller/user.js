/**
 * Created by zeev on 2016/10/12 0012.
 */

var debug = require('debug')('zeev:user');
var handleError = require("../utils").handleError;

module.exports = {
	adminRequired: adminRequired,
	signin       : signin
}
function adminRequired(req, res, next) {
	//	var user = req.session || req.session.user;
	var user = null,
		method = req.method;
	if (!user) {
		debug("user", req.method);
		if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
			return res.status(403).send({ msg: '用户权限不够' });
		}
		return res.redirect(303, '/signin');
	}
	next();
}

function signin(req, res) {
	var _user = {
		name    : req.body.name,
		password: req.body.password
	}
	debug("signin", _user);
	User.findOne({ name: _user.name }, handleError(function (user) {
		if (!user) {
			res.sendStatus(403);
		} else {
			user.compare(_user, function (err, isMatch) {
				if (err) {
					res.sendStatus(500);
				}
				if (isMatch && user.role >= 10) {
					req.session.user = user;
					res.cookie('active', 'true');
					res.cookie('name', user.name);
					res.cookie('role', user.role);
					res.sendStatus(200);
				} else {
					res.sendStatus(403);
				}
			})
		}
	}))
}
