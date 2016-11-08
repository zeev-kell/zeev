/**
 * Created by zeev on 2016/7/20 0020.
 */
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