/**
 * Created by zeev on 2016/7/28 0028.
 */

angular.module('app.service')
	.service('httpInterceptor', ['$q', '$rootScope', '$log', '$window',
		function ($q, $rootScope, $log, $window) {

			this.request = function (config) {
				//$log.log("请求之前: ", config);
				config.headers = config.headers || {};
				var token = $rootScope.authorizationService.getToken();
				if (token) {
					config.headers["Authorization"] = "Bearer " + token.accessToken;
					config.headers["Accept-Language"] = 'en'
				}
				return config;
			};
			this.response = function (response) {
				//				$log.log(response);
				return response;
			};
			this.requestError = function (response) {
				// 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
				$log.log("请求发生了错误: ", response);
				//return response; // 或新的promise
				// 或者，可以通过返回一个rejection来阻止下一步
				// return $q.reject(rejection);
			};
			this.responseError = function (rejection) {
				$log.log("响应发生了错误: ", rejection);
				return $q.reject(rejection);
			}
		}])