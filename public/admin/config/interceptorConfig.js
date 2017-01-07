/**
 * Created by zeev on 2016/7/20 0020.
 */

"use strict";
angular.module('app.config')
    .config(["$logProvider", function($logProvider) {
        $logProvider.debugEnabled(!0);
    }])
    .config(['$httpProvider', 'cfpLoadingBarProvider', function($httpProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        //$httpProvider.defaults.useXDomain = true;
        //$httpProvider.defaults.withCredentials = true;
        /* 拦截器配置 */
        //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('httpInterceptor'); //--拦截器--
    }])
