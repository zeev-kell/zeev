"use strict";angular.module("app.service").run(["$rootScope","authorizationService",function(e,t){e.user=t,e.authorizationService=t}]).service("authorizationService",["$q","$rootScope","$http","$window","$location","$log",function(e,t,n,o,i,r){this.setToken=function(e){window.localStorage.setItem("adminToken",JSON.stringify(e)),this.token=e},this.getToken=function(){return this.token},this.refreshToken=function(){this.checkToken().then(function(){})},this.toSingin=function(e){e&&e.preventDefault(),window.localStorage.removeItem("adminToken"),r.log("toSingin"),o.location.href="/singin.html"},this.checkToken=function(e){if("string"==typeof localStorage.adminToken){var t;try{t=JSON.parse(localStorage.adminToken)}catch(e){}return!(!t||"number"!=typeof t.expireAt||!moment().isBefore(1e3*t.expireAt))&&(this.token=t,t)}return!1},this.checkToken()}]);