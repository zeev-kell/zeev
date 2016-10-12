/**
 * Created by zeev on 2016/7/20 0020.
 */
!(function (angular) {
	"use strict";
	angular.module("app", [
		"ui.router",
		"ui.router.stateHelper",
		"ngCookies",
		"ui.bootstrap",
		"oc.lazyLoad",
		"ngAnimate",
		"vBusy",
		'angular-loading-bar',
		"app.config",
		"app.service",
		"app.directive",
		"app.controller",
		"app.component"
	])
})(angular);