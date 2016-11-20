/**
 * Created by zeev on 2016/7/21 0021.
 */

"use strict";
angular.module("app.controller", [])
    .controller("adminController", ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal) {
        var _$ctrl = this;
        $http({
            method: "GET",
            url: "/message"
        }).success(function(messages) {
            _$ctrl.messages = messages;
        });
        _$ctrl.showMessage = function(message) {
            $uibModal.open({
                animation: true,
                templateUrl: 'views/template/post-settings.html',
                windowTemplateUrl: 'views/template/aside.html',
                size: "md aside-right",
                resolve: {
                    message: function() {
                        return message;
                    }
                }
            });
        }
    }])
