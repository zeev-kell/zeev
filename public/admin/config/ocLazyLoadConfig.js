/**
 * Created by zeev on 2016/7/20 0020.
 */
"use strict";
angular.module('app.config')
	.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
		var libsPath = "/public/libs/";
		var bower = "/bower_components/"
		$ocLazyLoadProvider.config({
			debug  : false,
			events : false, //--加载module的事件冒泡--
			modules: [{
				name : 'akoenig.deckgrid',
				files: [bower + "angular-deckgrid/angular-deckgrid.js", libsPath + 'css/deckgrid.css']
			}, {
				name : 'd3',
				files: [bower + "d3/d3.js"]
			}, {
				name : 'showdown',
				files: [bower + "showdown/compressed/Showdown.js"]
			}]
		});
	}])
