/**
 * Created by zeev on 2016/7/11 0011.
 */

!(function (angular) {
	"use strict";
	angular.module("app")
		.directive("fieldWrap", [function () {
			return {
				restrict  : 'EA',
				controller: angular.noop,
				link   : function (element, attr) {
					return function (scope, $element, $attr, ctrl, $transclude) {

					};
				}
			}
		}])
})(angular);