"use strict";
angular.module("app.directive")
    .directive("layoutLoading", ["$rootScope", function($rootScope) {
        return {
            restrict: 'AE',
            link: function(scope, element, attrs) {
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('ng-hide');
                });
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('ng-hide');
                });
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('ng-hide');
                });
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('ng-hide');
                });
            }
        }
    }])
