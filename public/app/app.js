"use strict";

var app = angular
  .module("AngularSingleSpa", ["ngRoute"])
  .directive("displaySinglespa", [
    function () {
      return {
        restrict: "E",
        templateUrl: "assets/templates/display-singlespa.template.html",
      };
    },
  ])
  .config(function ($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "assets/templates/home.template.html",
      controller: "homeController",
    })
    $routeProvider.when("/pageOne", {
      templateUrl: "assets/templates/pageOne.template.html",
      controller: "pageOneController",
    })
    $routeProvider.when("/pageTwo", {
      templateUrl: "assets/templates/pageTwo.template.html",
      controller: "pageTwoController",
    })
    
    ;
  })
  .run([
    "$q",
    "$rootScope",
    "$timeout",
    function ($q, $rootScope, $timeout) {
      $rootScope.loading = true;
    },
  ]);
