/**
 * Created by zeev on 2016/7/28 0028.
 */

"use strict";
angular.module("app.controller", [])
	.controller("essayListCtrl", ["$scope", "$http", "SweetAlert", function ($scope, $http, SweetAlert) {
		var _this = this;
		$http({
			method: "GET",
			url   : "/post"
		}).success(function (data) {
			_this.posts = data;
		});
		$scope.remove = function (_id) {
			SweetAlert.swal({
				title             : "Are you sure?",
				text              : "Your will not be able to recover this imaginary file!",
				type              : "warning",
				showCancelButton  : true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText : "Yes, delete it!",
				closeOnConfirm    : false
			}, function () {
				return $http({
					method: "DELETE",
					url   : "/post/" + _id
				}).success(function (data) {
					SweetAlert.swal("Good job!", "删除成功!", "success");
					$http({
						method: "GET",
						url   : "/post"
					}).success(function (data) {
						_this.posts = data;
					});
				})
			});
		}
	}])
