/**
 * Created by zeev on 2016/10/13 0013.
 */
"use strict";
angular.module("app.controller", [])
	.controller("essayEditorCtrl", ["$scope", "$http", "$uibModal", "SweetAlert", function ($scope, $http, $uibModal, SweetAlert) {
		$scope.post = {
			markdown: ''
		}
		$http({
			method: "GET",
			url   : "/post/" + $scope.$stateParams.id
		}).success(function (data) {
			$scope.post = data;
			$scope.post.tags = $scope.post.tags || [];
		})
		$scope.open = function () {
			$uibModal.open({
				animation  : true,
				templateUrl: 'views/template/markdown-content.html',
				size       : "md"
			});
		};
		$scope.postSettings = function () {
			$uibModal.open({
				animation        : true,
				templateUrl      : 'views/template/post-settings.html',
				windowTemplateUrl: 'views/template/aside.html',
				size             : "md aside-right",
				controller       : 'postModalInstance',
				resolve          : {
					post: function () {
						return $scope.post;
					}
				}
			});
		}
		$scope.ok = function () {
			return $http({
				method: "PUT",
				data  : $scope.post,
				url   : "/post/" + $scope.post._id
			}).success(function (data) {
				$scope.post.tags = $scope.post.tags || [];
				SweetAlert.swal("Good job!", "修改成功!", "success")
			})
		}
	}])
	.controller("postModalInstance", ["$scope", "$http", "post", function ($scope, $http, post) {
		$scope.post = post;
	}])
	.filter('getCol', function () {
		return function (items, row) {
			return items && items.map(function (item) {
					return item[row];
				}).join(',');
		}
	})
	.directive('tagEditor', function () {
		return {
			restrict   : 'AE',
			scope      : {
				tags: '=ngModel'
			},
			replace    : true,
			templateUrl: 'views/template/ng-tag-editor.html',
			controller : ['$scope', '$attrs', '$element', '$http', '$filter', function ($scope, $attrs, $element, $http, $filter) {
				$scope.options = [];
				$scope.options.output = $attrs.output || 'name';
				$scope.options.fetch = $attrs.fetch || '/tag';
				$scope.options.placeholder = $attrs.placeholder || 'Enter a few letters...';
				$scope.options.apiOnly = $attrs.apiOnly || false;
				$scope.search = '';

				$http.get($scope.options.fetch)
					.success(function (data) {
						$scope.suggestions = data;
					});

				//$scope.$watch('search', function () {
				//$http.get($scope.options.fetch + $scope.search).success(function(data){
				//    $scope.suggestions = data;
				//    /* console.log(data); */
				//});
				//});
				$scope.add = function (id, name) {
					var tag = $scope.tags.filter(function (tag) {
						return tag.name == name;
					});
					if (tag.length == 0) {
						var suggestion = $scope.suggestions.filter(function (suggestion) {
							return suggestion.name == name;
						});
						if (suggestion.length == 0) {
							$scope.tags.push({ 'name': name });
						} else {
							$scope.tags.push(suggestion[0]);
						}
					}
					$scope.search = '';
				};
				$scope.remove = function (index) {
					$scope.tags.splice(index, 1);
				};

				$scope.tagsFilter = function (item) {
					return $scope.tags.filter(function (tag) {
							return tag._id === item._id || tag.name === item.name;
						}).length == 0 && ($scope.search == '' || item.name.indexOf($scope.search) >= 0);
				}

				$element.find('input').on('keydown', function (e) {
					var keys = [8, 13, 32];
					if (keys.indexOf(e.which) !== -1) {
						if (e.which == 8) { /* backspace */
							if ($scope.search.length === 0 && $scope.tags.length) {
								$scope.tags.pop();
								e.preventDefault();
							}
						} else if (e.which == 32 || e.which == 13) { /* space & enter */
							if ($scope.search.length && !$scope.apiOnly) {
								if (!$scope.apiOnly) {
									$scope.add(0, $scope.search);
									e.preventDefault();
								}
							}
						}
						$scope.$apply();
					}
				}).on('blur', function (e) {
					if ($scope.search.length && !$scope.apiOnly) {
						if (!$scope.apiOnly) {
							$scope.add(0, $scope.search);
							e.preventDefault();
						}
					}
					$scope.$apply();
				})

			}]
		}
	});
