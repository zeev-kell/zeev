/**
 * Created by zeev on 2016/11/6 0006.
 */
var _         = require('lodash'),
	validator = require("../utils/validate").validator,
	visitor   = require('../api').visitor,
	errors    = require("../errors");

function hasRecord(req) {
	if (_.isEmpty(req.cookies.email) || _.isEmpty(req.cookies._v)) {
		return false;
	}
	return validator.isEmail(req.cookies.email) && validator.matches(req.cookies._v, /^[0-9a-fA-F]{24}$/);
}


exports.confirm = function (req, res, next) {

	/**
	 * 存在记录 next
	 */
	if (req.body.isUseRecord == "on" && hasRecord(req)) {
		req.body._v = req.cookies._v;
		return next();
	}

	/**
	 * 邮箱校验正确
	 */
	if (!validator.isEmail(req.body.email)) {
		return errors.handlerRenderError(new errors.ValidationError('Email is required !'), req, res, next);
	}

	/**
	 * 查询是否有记录
	 */
	return visitor.findByEmail(req.body.email)
		.then(function (v) {
			var time = new Date(Date.now() + 3600000);
			if (v) {
				res.cookie('_v', v._id, { expires: time });
				res.cookie('email', v.email, { expires: time });
				res.cookie('name', v.name, { expires: time });
				res.cookie('image', v.image, { expires: time });
				req.body._v = v._id;
				next();
			} else {
				return visitor.create({
					email: req.body.email,
					name : req.body.name,
					url  : req.body.url,
					image: req.body.image,
					ip   : req.ip
				}).then(function (_v) {
					res.cookie('_v', _v._id, { expires: time });
					res.cookie('email', _v.email, { expires: time });
					res.cookie('name', _v.name, { expires: time });
					res.cookie('image', _v.image, { expires: time });
					req.body._v = _v._id;
					next();
				})
			}
		}).catch(errors.handleCatchError(req, res, next))

}
