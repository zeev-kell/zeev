// # Errors
/*jslint regexp: true */
var _                          = require('lodash'),
	debug                      = require('debug')('zeev:errors'),
	Promise                    = require('bluebird'),
	hbs                        = require('express-hbs'),
	NotFoundError              = require('./not-found-error'),
	BadRequestError            = require('./bad-request-error'),
	InternalServerError        = require('./internal-server-error'),
	NoPermissionError          = require('./no-permission-error'),
	MethodNotAllowedError      = require('./method-not-allowed-error'),
	RequestEntityTooLargeError = require('./request-too-large-error'),
	UnauthorizedError          = require('./unauthorized-error'),
	ValidationError            = require('./validation-error'),
	UnsupportedMediaTypeError  = require('./unsupported-media-type-error'),
	EmailError                 = require('./email-error'),
	DataImportError            = require('./data-import-error'),
	TooManyRequestsError       = require('./too-many-requests-error'),
	config,
	errors,

	// Paths for views
	userErrorTemplateExists    = false;

/**
 * Basic error handling helpers
 */
errors = {

	throwError        : function (err) {
		if (!err) {
			err = new Error('An error occurred');
		}
		if (_.isString(err)) {
			throw new Error(err);
		}
		throw err;
	},
	rejectError       : function rejectError(err) {
		return Promise.reject(err);
	},
	handleCatchError  : function handleCatchError(req, res, next) {
		var _this = this;
		return function (err) {
			debug(err);
			_this.renderErrorPage(500, err, req, res, next);
		}
	},
	handlerRenderError: function handlerRenderError(err, req, res, next) {
		this.renderErrorPage(err.code, err, req, res, next);
	},
	handleAPIError    : function handleAPIError(err, req, res, next) {
		var httpErrors = this.formatHttpErrors(err);
		res.status(httpErrors.statusCode).json({ errors: httpErrors.errors });
	},
	formatHttpErrors  : function formatHttpErrors(error) {
		var statusCode = 500,
			errors     = [];
		if (!_.isArray(error)) {
			error = [].concat(error);
		}
		_.each(error, function each(errorItem) {
			var errorContent       = {};
			statusCode             = errorItem.code || 500;
			errorContent.message   = _.isString(errorItem) ? errorItem :
				(_.isObject(errorItem) ? errorItem.message : 'Unknown API Error');
			errorContent.errorType = errorItem.errorType || 'InternalServerError';
			errors.push(errorContent);
		});

		return { errors: errors, statusCode: statusCode };
	},
	renderErrorPage   : function (code, err, req, res, next) {
		res.status(code || 500);
		res.render('views/error', {
			message: err,
			code   : code,
			req    : req
		}, function (templateErr, html) {
			if (!templateErr) {
				return res.status(code).send(html);
			}
			// There was an error trying to render the error page, output the error
			// And then try to explain things to the user...
			// Cheat and output the error using handlebars escapeExpression
			return res.status(500).send(
				'<h1>Oops, seems there is an error in the error template.</h1>' +
				'<p>Encountered the error: </p>' +
				'<pre>' + hbs.handlebars.Utils.escapeExpression(templateErr.message || templateErr) + '</pre>' +
				'<br ><p>whilst trying to render an error page for the error: </p>' +
				code + ' ' + '<pre>' + hbs.handlebars.Utils.escapeExpression(err.message || err) + '</pre>'
			);
		});
	},

	error404: function (req, res, next) {
		var message = '页面未找到';

		// do not cache 404 error
		res.set({ 'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0' });

		if (req.method === 'GET') {
			if (/\.((js)|(png)|(css)|(jpg))$|bower_components/.test(req.path)) {
				res.sendStatus(404);
			} else {
				var err    = new Error('Not Found');
				err.status = 404;
				//				res.render('views/404', {
				//					message: err,
				//					code   : 404,
				//					req    : req,
				//					title  : 'Not Found'
				//				})
				this.renderErrorPage(404, err, req, res, next)
			}
		} else {
			res.status(404).send(message);
		}
	},

	error500: function (err, req, res, next) {
		// 500 errors should never be cached
		res.set({ 'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0' });

		console.log(err);
		if (err.status === 404 || err.code === 404) {
			return this.error404(req, res, next);
		}

		if (req.method === 'GET') {
			if (!err || !(err instanceof Error)) {
				next();
			}
			errors.renderErrorPage(err.status || err.code || 500, err, req, res, next);
		} else {
			var statusCode   = 500,
				returnErrors = [];

			if (!_.isArray(err)) {
				err = [].concat(err);
			}

			_.each(err, function (errorItem) {
				var errorContent = {};

				statusCode = errorItem.code || 500;

				errorContent.message   = _.isString(errorItem) ? errorItem :
					(_.isObject(errorItem) ? errorItem.message : 'Unknown Error');
				errorContent.errorType = errorItem.errorType || 'InternalServerError';
				returnErrors.push(errorContent);
			});

			res.status(statusCode).json({ errors: returnErrors });
		}
	}
};

// Ensure our 'this' context for methods and preserve method arity by
// using Function#bind for expressjs
_.each([
	'renderErrorPage',
	'handleCatchError',
	'handleAPIError',
	'rejectError',
	'formatHttpErrors',
	'error404',
	'error500'
], function (funcName) {
	errors[funcName] = errors[funcName].bind(errors);
});


module.exports                            = errors;
module.exports.handleError                = function (next) {
	return function handleError(err) {
		debug("handleError", err);
		// If we've thrown an error message of type: 'NotFound' then we found no path match.
		if (err.errorType === 'NotFoundError') {
			return next(err);
		}
		if (err.name == "ValidationError") {

		}
		return next(err);
	};
}
module.exports.NotFoundError              = NotFoundError;
module.exports.BadRequestError            = BadRequestError;
module.exports.InternalServerError        = InternalServerError;
module.exports.NoPermissionError          = NoPermissionError;
module.exports.UnauthorizedError          = UnauthorizedError;
module.exports.ValidationError            = ValidationError;
module.exports.RequestEntityTooLargeError = RequestEntityTooLargeError;
module.exports.UnsupportedMediaTypeError  = UnsupportedMediaTypeError;
module.exports.EmailError                 = EmailError;
module.exports.DataImportError            = DataImportError;
module.exports.MethodNotAllowedError      = MethodNotAllowedError;
module.exports.TooManyRequestsError       = TooManyRequestsError;
