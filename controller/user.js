/**
 * Created by zeev on 2016/10/12 0012.
 */

var debug  = require('debug')('zeev:user');
var utils  = require("../utils");
var errors = require("../errors");
var User   = global.dbHelper.getModel("User");

exports.signin = function (req, res, next) {
	var _user = {
		name    : req.body.name,
		password: req.body.password
	}
	debug("signin", _user.name);
	User.findOne({ name: _user.name })
		.then(function (user) {
			if (user && user.compare(_user) && user.role >= 10) {
				req.session.user = user;
				res.cookie('active', 'true');
				res.cookie('name', user.name);
				res.cookie('role', user.role);
				return res.sendStatus(200);
			} else {
				return res.status(403).send({ msg: "用户不存在或权限不够..." });
			}
		}).catch(errors.handleError(next))
}