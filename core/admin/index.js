/**
 * Created by zeev on 2016/7/20 0020.
 */

angular.module('app.component', []);
angular.module('app.config', []);
angular.module("app.controller", []);
angular.module("app.directive", []);
angular.module("app.filter", []);
angular.module('app.service', []);
!(function (angular) {
	"use strict";
	angular.module("app", [
		"ui.router",
		"ui.router.stateHelper",
		"ngCookies",
		"ngSanitize",
		"ui.bootstrap",
		"oc.lazyLoad",
		"ngAnimate",
		"vBusy",
		"ngSweetAlertFull",
		'angular-loading-bar',
		"app.config",
		"app.service",
		"app.directive",
		"app.controller",
		"app.component",
		"app.filter"
	])
})(angular);