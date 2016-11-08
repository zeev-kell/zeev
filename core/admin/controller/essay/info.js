/**
 * Created by zeev on 2016/7/28 0028.
 */

"use strict";
angular.module("app.controller", [])
	.controller("essayInfoCtrl", ["$scope", "$http", function ($scope, $http) {
		$http({
			method: "GET",
			url   : "/post/" + $scope.$stateParams.id
		}).success(function (data) {
			$scope.post = data;
		})
		this.updateComment = function (comment, type) {
			return $http({
				method: "put",
				url   : "comment/" + comment._id,
				data  : {
					status: type
				}
			}).success(function (data) {
				comment.status = data.status;
			})
		}
	}])
