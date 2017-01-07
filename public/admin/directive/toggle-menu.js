/**
 * Created by Administrator on 2016/11/8 0008.
 */
angular.module("app.directive")
    .directive("toggleMenu", [function () {
        return function (scope, element, attr) {
            scope.$on('$stateChangeStart', function () {
                $(".sidebar-menu").removeClass(attr.toggleMenu);
            });
            angular.element(element)
                .click(function () {
                    $(".sidebar-menu").toggleClass(attr.toggleMenu);
                })
        }
    }])