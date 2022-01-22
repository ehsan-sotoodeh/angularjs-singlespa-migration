'use strict';
var app = angular.module('AngularSingleSpa', ['ngRoute']).config(function($routeProvider){
  $routeProvider
    .when("/home",{
      templateUrl: "assets/templates/home.html",
      controller:"homeController"
    })
})

app.run(['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout) {
  $rootScope.loading = true;
}]);