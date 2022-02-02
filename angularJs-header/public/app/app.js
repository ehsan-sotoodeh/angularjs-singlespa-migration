"use strict";

var app = angular
  .module("AngularSingleSpaHeader", ["ngRoute"])
  .directive("displaySinglespaHeader", [
    function () {
      return {
        restrict: "E",
        templateUrl: "http://localhost:8001/assets/templates/display-singlespa-header.template.html",
      };
    },
  ])
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://localhost:8001/**'
    ]);
}])
  .run([
    "$q",
    "$rootScope",
    "$timeout",
    function ($q, $rootScope, $timeout) {
      $rootScope.loading = true;
    },
  ]);

  
  var app2 = angular
  .module("AngularSingleSpaSidebar", ["ngRoute"])
  .directive("displaySinglespaSidebar", [
    function () {
      return {
        restrict: "E",
        templateUrl: "http://localhost:8001/assets/templates/display-singlespa-sidebar.template.html",
      };
    },
  ])
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://localhost:8001/**'
    ]);
}])
  .run([
    "$q",
    "$rootScope",
    "$timeout",
    function ($q, $rootScope, $timeout) {
      $rootScope.loading = true;
    },
  ]);

