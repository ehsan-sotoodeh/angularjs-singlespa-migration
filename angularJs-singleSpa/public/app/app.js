"use strict";

var app = angular
  .module("AngularSingleSpa", ["ngRoute"])
  .directive("displaySinglespa", [
    function () {
      return {
        restrict: "E",
        templateUrl: "http://localhost:8001/assets/templates/display-singlespa.template.html",
      };
    },
  ])
  .config(function ($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "http://localhost:8001/assets/templates/home.template.html",
      controller: "homeController",
    })
    $routeProvider.when("/pageOne", {
      templateUrl: "http://localhost:8001/assets/templates/pageOne.template.html",
      controller: "pageOneController",
    })
    $routeProvider.when("/pageTwo", {
      templateUrl: "http://localhost:8001/assets/templates/pageTwo.template.html",
      controller: "pageTwoController",
    })
    
    ;
  })
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

  // System.register([], function(_export) {
  //   return {
  //     execute: function() {
  //       _export(window.singleSpaAngularjs.default({
  //         angular: angular,
  //         domElementGetter: function () {
  //           return document.getElementById('load-angular-here')
  //         },
  //         mainAngularModule: 'angularjs',
  //         uiRouter: true,
  //         preserveGlobal: false,
  //         template: '<display-singlespa />',
  //       }))
  //     }
  //   }
  // })

 var myAngularApp = window.singleSpaAngularjs.default({
    angular: angular,
    domElementGetter: function () {
      return document.getElementById('load-angular-here')
    },
    mainAngularModule: 'AngularSingleSpa',
    uiRouter: true,
    preserveGlobal: false,
    template: '<display-singlespa />',
  })

  console.log(myAngularApp)
  // singleSpa.registerApplication('AngularSingleSpa', myAngularApp, function activityFunction(location) {
  //   return location.hash.startsWith('');
  // })
  
  
  // singleSpa.start()