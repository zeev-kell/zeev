/**
 * Created by zeev on 2016/11/6 0006.
 */

var _ = require('lodash'),
    validator = require('validator'),
    errors = require("../errors");

exports.validator = validator;

exports.isObjectId = function isObjectId(_v) {
    return validator.matches(_v, /^[0-9a-fA-F]{24}$/)
}
