/**
 * Created by zeev on 2016/7/31 0031.
 */


"use strict";
angular.module("app.directive")
	.directive("barMenu", ["$animateCss", "$timeout", function ($animateCss, $timeout) {
		return {
			restrict  : 'AE',
			controller: ["$scope", "$element", function ($scope, $element) {
				var barMenuCtrl = this;
				barMenuCtrl.collapse = function ($li) { /* 收起 */
					var $sub = $li.children('ul'),
						$sub_item = $sub.children();
					if (!$sub.hasClass('collapse') && !$sub.hasClass('in')) {
						$sub.css({ height: '0' })
							.removeClass('collapsing')
							.addClass('collapse');
						$li.removeClass("expanded");
						return;
					}
					$sub_item.addClass('hidden-item');
					$sub.css({ height: $sub[0].scrollHeight + 'px' })
						.removeClass('collapse')
						.addClass('collapsing')
						.attr('aria-expanded', false)
						.attr('aria-hidden', true);

					$animateCss($sub, {
						removeClass: 'in',
						to         : { height: '0' }
					}).start()['finally'](function () {
						$sub.css({ height: '0' })
							.removeClass('collapsing')
							.addClass('collapse');
						$sub_item.removeClass('hidden-item');
						$li.removeClass("expanded");
					});
				}
				barMenuCtrl.expand = function ($li) { /* 展开 */
					if (barMenuCtrl.timeout) {
						$timeout.cancel(barMenuCtrl.timeout);
					}
					var $sub = $li.children('ul'),
						$sub_item = $sub.children();
					if ($sub.hasClass('collapse') && $sub.hasClass('in')) {
						return;
					}
					var $li_ = $li.siblings('.expanded');
					/* 三级菜单这里有问题  (已修复)*/
					if ($li_.length > 0) {
						barMenuCtrl.collapse($li_);
					}
					$li.addClass("expanded");
					$sub.removeClass('collapse')
						.addClass('collapsing')
						.attr('aria-expanded', true)
						.attr('aria-hidden', false);
					$sub_item.addClass('is-hidden');
					$animateCss($sub, {
						addClass: 'in',
						easing  : 'ease',
						to      : { height: $sub[0].scrollHeight + 'px' }
					}).start()['finally'](function () {
						$sub.removeClass('collapsing')
							.addClass('collapse')
							.css({ height: 'auto' });
						$animateCss($sub_item, {
							addClass: 'is-shown'
						}).start()['finally'](function () {
							$sub_item.removeClass('is-hidden is-shown');
						})
					});
				}
			}],
			link      : function (scope, element, attr, barMenuCtrl) {
				var $items = angular.element(element).find('li:has(> ul)');
				$items.addClass('has-sub');
				$items.each(function (i, $li) {
					$li = angular.element($li);
					$li.children('a').on('click', function (event) {
						//							console.log($li);
						if ($li.hasClass("expanded")) {
							barMenuCtrl.collapse($li);
						} else {
							barMenuCtrl.expand($li)
						}
					});
				});
				barMenuCtrl.timeout = $timeout(function () {
					var $li = angular.element(element).find('li.active');
					//						console.log($li);
					if ($li.length > 0) {
						/* 三级菜单 未修复 */
						if ($li.parent().parent().parent().parent().parent().hasClass("main-menu")) {
							barMenuCtrl.expand($li.parent().parent().parent().parent());
							barMenuCtrl.expand($li.parent().parent());
						} else {
							barMenuCtrl.expand($li.parent().parent());
						}
					}
				}, 1000)
			}
		}
	}])