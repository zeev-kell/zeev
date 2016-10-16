/**
 * Created by zeev on 2016/7/20 0020.
 */

"use strict";

/**
 * lazyLoad state
 * @param option 正常的state配置对象，需要lazy加载的文件 为 src 字段
 * @returns {*} 目前返回的对象中 lazyLoad 为固定，后期可以修改
 */
var lazyLoadState = function (option) {
	if (option.src) {
		option.resolve = angular.extend(option.resolve || {}, {
			lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load(option.src);
			}]
		})
	}
	return option;
}

angular.module('app.config')
	.config(["$stateProvider", "$urlRouterProvider", "stateHelperProvider", function ($stateProvider, $urlRouterProvider, stateHelperProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('index', lazyLoadState({
				url        : "/",
				templateUrl: 'views/index.html'
			}))
		stateHelperProvider
			.state(lazyLoadState({
				name       : 'home',
				url        : "/home",
				templateUrl: 'views/home/index.html',
				children   : [
					lazyLoadState({
						name       : 'notice',
						url        : "/notice",
						templateUrl: 'views/home/notice.html'
					})
				]
			}))
			.state(lazyLoadState({
				name       : 'essay',
				url        : "/essay",
				templateUrl: 'views/essay/index.html',
				children   : [
					lazyLoadState({
						name       : 'list',
						url        : "/list",
						src        : ['controller/essay/list.js', 'akoenig.deckgrid'],
						templateUrl: 'views/essay/list.html',
						controller : 'essayListCtrl as eLCtrl'
					}),
					lazyLoadState({
						name       : 'new',
						url        : "/new",
						src        : ['controller/essay/new.js','showdown'],
						templateUrl: 'views/essay/new.html',
						controller : 'essayNewCtrl as eNCtrl'
					}),
					lazyLoadState({
						name       : 'info',
						url        : "/info/:id",
						src        : ['controller/essay/info.js'],
						templateUrl: 'views/essay/info.html',
						controller : 'essayInfoCtrl as eICtrl'
					}),
					lazyLoadState({
						name       : 'editor',
						url        : "/editor/:id",
						src        : ['controller/essay/editor.js', 'showdown'],
						templateUrl: 'views/essay/editor.html',
						controller : 'essayEditorCtrl as eECtrl'
					})
				]
			}))
	}])
	.run(["$rootScope", "$state", "$stateParams", "$urlRouter",
		function ($rootScope, $state, $stateParams, $urlRouter) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

			})
			$rootScope.$on('$locationChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {

			})

		}
	])
