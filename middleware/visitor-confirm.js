/**
 * Created by zeev on 2016/11/6 0006.
 */
var _ = require('lodash'),
    validator = require("../utils/validate").validator,
    visitor = require('../api').visitor,
    errors = require("../errors");

function hasRecord(req) {
    if (_.isEmpty(req.cookies.email) || _.isEmpty(req.cookies._v)) {
        return false;
    }
    return validator.isEmail(req.cookies.email) && validator.matches(req.cookies._v, /^[0-9a-fA-F]{24}$/);
}


exports.confirm = function(req, res, next) {

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
        .then(function(v) {
            if (v) {
                res.cookie('_v', v._id);
                res.cookie('email', v.email);
                res.cookie('name', v.name);
                req.body._v = req.cookies._v;
                next();
            } else {
                return visitor.create({
                    email: req.body.email,
                    name: req.body.name,
                    url: req.body.url,
                    ip: req.ip
                }).then(function(_v) {
                    res.cookie('_v', _v._id);
                    res.cookie('email', _v.email);
                    res.cookie('name', _v.name);
                    req.body._v = req.cookies._v;
                    next();
                })
            }
        }).catch(errors.handleCatchError(req, res, next))

}
