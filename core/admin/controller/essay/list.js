/**
 * Created by zeev on 2016/7/28 0028.
 */

"use strict";
angular.module("app.controller", [])
	.controller("essayListCtrl", ["$scope", "$http", function ($scope, $http) {
		var _this = this;
		$http({
            method: "GET",
            url: "/post"
        }).success(function (data) {
            _this.posts = data;
        });
	}])
