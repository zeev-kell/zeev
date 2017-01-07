/**
 * Created by zeev on 2016/7/20 0020.
 */
"use strict";
angular.module('app.service')
	.run(["$rootScope", "authorizationService",
		function ($rootScope, authorizationService) {

			$rootScope.user = authorizationService;
			$rootScope.authorizationService = authorizationService;

		}])
	.service('authorizationService', ['$q', '$rootScope', '$http', '$window', '$location', '$log',
		function ($q, $rootScope, $http, $window, $location, $log) {
			var _this = this;
			this.setToken = function (token) {
				window.localStorage.setItem("adminToken", JSON.stringify(token));
				this.token = token;
			}
			this.getToken = function () {
				return this.token;
			}
			this.refreshToken = function () {
				this.checkToken().then(function () {

				})
			}
			this.toSingin = function (event) {
				if (event) {
					event.preventDefault();
				}
				window.localStorage.removeItem("adminToken");
				$log.log('toSingin');
				$window.location.href = "/singin.html";
			}
			this.checkToken = function (event) {
				if (typeof localStorage.adminToken === 'string') {
					var token;
					try {
						token = JSON.parse(localStorage.adminToken);
					} catch (e) {
						// handle below
					}
					if (token && typeof token.expireAt === 'number' && moment().isBefore(token.expireAt * 1000)) {
						this.token = token;
						return token;
					} else {
						// this.toSingin(event);
						return false;
					}
				} else {
					// this.toSingin(event);
					return false;
				}
			}
			this.checkToken();
		}
	]);

