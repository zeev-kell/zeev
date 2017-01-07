/**
 * Created by zeev on 2016/7/19 0019.
 */
!(function (angular) {
	"use strict";
	angular.module('vBusy', [
		'vBusy.config',
		'vBusy.directives'
	]);

	angular.module("vBusy.directives", [])
		.directive("vBusyClick", ["buttonConfig", "$log", "$q", "$parse", function (buttonConfig, $log, $q, $parse) {
			return {
				restrict: 'AE',
				scope   : {
					isBusy   : '=?vBusy',
					busyLabel: '@vBusyLabel',
					busyText : '@vBusyText'
				},
				require : ['^?form'],
				compile : function (tElement, tAttrs) {
					var labelElement = angular.element(tElement.find('span'));

					if (!labelElement[0]) {
						tElement.html('<span>' + tElement.html() + '</span>');
						labelElement = angular.element(tElement.find('span'));
					}

					return function postLink(scope, iElement, iAttrs, FormCtrl) {
						var idleLabelHtml = labelElement.html(),
							busyLabelHtml = scope.busyLabel || buttonConfig.busyLabel,
							busyTextHtml = scope.busyText;

						scope.$watch('isBusy', function (value) {
							if (value) {
								iElement.addClass(buttonConfig.states.busy);
								labelElement.html(busyLabelHtml);
							} else {
								iElement.removeClass(buttonConfig.states.busy);
								labelElement.html(busyTextHtml || idleLabelHtml);
							}
						});

						function ElementClick() {
							if (scope.isBusy) {
								$log.log("isBusy:" + scope.isBusy);
								return true;
							}
							if (iAttrs.type == "submit" && FormCtrl && FormCtrl[0]) { /* -- 按钮submit 含有 FormCtrl -- */
								if (FormCtrl[0].$valid) {
									scope.isBusy = true;
									$q.resolve($parse(iAttrs.vBusyClick)(scope.$parent))
										.finally(function () {
											scope.isBusy = false;
										});
								} else {
									$log.log("FormCtrl:" + FormCtrl[0].$valid);
								}
							} else {
								scope.isBusy = true;
								$q.resolve($parse(iAttrs.vBusyClick)(scope.$parent))
									.finally(function () {
										scope.isBusy = false;
									});
							}
						}

						iElement.on("click", ElementClick);

						tAttrs.$observe('vBusyLabel', function (value) {
							busyLabelHtml = value;
						});

						tAttrs.$observe('vBusyText', function (value) {
							busyTextHtml = value;
						});
					};
				}
			};
		}])
		.directive('vPressable', ['$document', 'buttonConfig', function ($document, buttonConfig) {
			return {
				restrict: 'A',
				link    : function (scope, iElement) {
					var isTouch = !!('undefined' !== typeof $document[0].documentElement.ontouchstart);
					var pressEvent = (isTouch) ? 'touchstart' : 'mousedown',
						releaseEvent = (isTouch) ? 'touchend' : 'mouseup';

					var bodyElement = angular.element($document[0].body);

					function makeRipple(posX, posY) {
						var rect = iElement[0].getBoundingClientRect(),
							ripple = iElement[0].querySelector('v-ripple');

						var top, left;

						angular.element(ripple).remove();

						ripple = $document[0].createElement('v-ripple');
						ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';

						iElement.append(ripple);

						left = posX - rect.left - ripple.offsetWidth / 2 - bodyElement[0].scrollLeft;
						top = posY - rect.top - ripple.offsetHeight / 2 - bodyElement[0].scrollTop;
						ripple.style.left = left + 'px';
						ripple.style.top = top + 'px';
					}

					function pressButton(event) {
						makeRipple(event.pageX, event.pageY);
						if (iElement.attr("isPressed")) {
							iElement.addClass(buttonConfig.states.pressed);
						}

						bodyElement.bind(releaseEvent, releaseButton);
					}

					function releaseButton(event) {
						if (iElement.attr("isPressed")) {
							iElement.removeClass(buttonConfig.states.pressed);
						}
						bodyElement.unbind(releaseEvent, releaseButton);
					}

					iElement.bind(pressEvent, pressButton);
				}
			};
		}]);

	angular.module('vBusy.config', [])
		.constant('buttonConfig', {
			busyLabel: 'Loading',
			states   : {
				busy   : 'is-busy',
				pressed: 'is-pressed'
			}
		});
})(angular);
