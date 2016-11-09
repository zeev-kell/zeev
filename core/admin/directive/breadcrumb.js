/**
 * Created by Administrator on 2016/11/8 0008.
 */
angular.module("app.directive")
    .directive("breadcrumb", ["$state", function ($state) {
        return function (scope, element, attr) {
            function reload() {
                var states = $state.$current.path.map(function (path) {
                    var self = path.self;
                    var name = self.url.split("/")[1] ? self.url.split("/")[1] : self.url.split("/")[0];
                    return {
                        state: self.name,
                        name : name
                    }
                })
                scope._$states = states;
            }
            scope.$on('$stateChangeSuccess', function () {
                reload();
            });
            reload();
        }
    }])