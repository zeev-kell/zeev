/**
 * Created by zeev on 2016/11/8 0008.
 */

angular.module("app.filter")
	.filter("moment", function () {
		return function (value, format) {
			/**
			 * �ж��Ƿ��� fromNow
			 */
			if (format == "fromNow") {
				return moment(value).fromNow();
			}
			/**
			 * Ĭ�� format = "lll"
			 * @type {*|string}
			 */
			format = format || 'LLL';
			return moment(value).format(format);
		}
	})