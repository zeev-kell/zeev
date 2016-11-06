/**
 * Created by zeev on 2016/11/6 0006.
 */

var _         = require('lodash'),
	validator = require('validator'),
	errors    = require("../errors");

module.exports           = function (docName, extras) {
	return function daValidate() {
		var object, options, permittedOptions = [];
		if (arguments.length === 2) {
			object  = arguments[0];
			options = _.clone(arguments[1] || {});
		} else if (arguments.length === 1) {
			options = _.clone(arguments[0]) || {};
		} else {
			options = {};
		}

		if (extras && extras.opts) {
			permittedOptions = permittedOptions.concat(extras.opts);
		}
		if ((extras && extras.attrs) || object) {
			//			permittedOptions = permittedOptions.concat(utils.dataDefaultOptions);
		}

		if (extras && extras.attrs) {
			options.data = _.pick(options, extras.attrs);
			options      = _.omit(options, extras.attrs);
		}

		function checkOptions(options) {
			options              = _.pick(options, permittedOptions);
			var validationErrors = validateOptions(options);
			if (_.isEmpty(validationErrors)) {
				return Promise.resolve(options);
			}
			return errors.rejectError(validationErrors[0]);
		}

		return checkOptions(options);
	}
}
module.exports.validator = validator;

function validateOptions(options) {
	var globalValidations = {
			id  : { matches: /^[0-9a-fA-F]{24}$/ },
			_id : { matches: /^[0-9a-fA-F]{24}$/ },
			uuid: { isUUID: true }
		},
		errors            = [];
	_.each(options, function (value, key) {
		if (globalValidations[key]) {
			errors = errors.concat(validate(value, key, globalValidations[key]));
		} else {
			errors = errors.concat(validate(value, key, globalValidations.slug));
		}
	});
	return errors;
}

function validateSchema(schemaName, model) {

}

function validate(value, key, validations) {
	var validationErrors = [];

	_.each(validations, function each(validationOptions, validationName) {
		var goodResult = true;

		if (_.isBoolean(validationOptions)) {
			goodResult        = validationOptions;
			validationOptions = [];
		} else if (!_.isArray(validationOptions)) {
			validationOptions = [validationOptions];
		}

		validationOptions.unshift(value);

		// equivalent of validator.isSomething(option1, option2)
		if (validator[validationName].apply(validator, validationOptions) !== goodResult) {
			validationErrors.push(new errors.ValidationError('Validation (' + validationName + ') failed for ' + key, key));
		}

		validationOptions.shift();
	}, this);

	return validationErrors;
};
