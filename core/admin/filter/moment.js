/**
 * Created by zeev on 2016/11/8 0008.
 */

angular.module("app.filter")
	.filter("moment", function () {
		return function (value, format) {
			/**
			 * ≈–∂œ «∑Ò « fromNow
			 */
			if (format == "fromNow") {
				return moment(value).fromNow();
			}
			/**
			 * ƒ¨»œ format = "lll"
			 * @type {*|string}
			 */
			format = format || 'LLL';
			return moment(value).format(format);
		}
	})