/**
 * Created by zeev on 2016/10/13 0013.
 */
"use strict";
angular.module("app.controller", [])
	.controller("tagListCtrl", ["$scope", "$http", function ($scope, $http) {
		$http({
			method: "GET",
			url   : "/tag"
		}).success(function (data) {
			$scope.tags = data;
		})
		$scope.remove = function (index) {
			$http({
				method: "DELETE",
				url   : "/tag/" + $scope.tags[index]._id
			}).success(function (data) {
				$scope.tags.splice(index, 1);
			})
		}
	}])
