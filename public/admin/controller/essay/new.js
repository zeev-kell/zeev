/**
 * Created by zeev on 2016/7/28 0028.
 */


"use strict";
angular.module("app.controller", [])
    .controller("essayNewCtrl", ["$scope", "$http", "SweetAlert", function($scope, $http, SweetAlert) {
        $scope.posts = {
            image: 'http://img02.tooopen.com/images/20140314/sy_56692371155.jpg',
            markdown: ""
        }
        $scope.ok = function() {
            if ($scope.posts.title) {
                return $http({
                    method: "POST",
                    data: $scope.posts,
                    url: "/post"
                }).success(function(data) {
                    $scope.$state.go("^.editor", { id: data._id });
                })
            }
        }
    }])
