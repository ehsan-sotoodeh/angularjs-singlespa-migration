"use strict";

var app = angular
  .module("AngularSingleSpaMain", ["ngRoute"])
  .directive("displaySinglespa", [
    function () {
      return {
        restrict: "E",
        templateUrl: "http://localhost:8002/assets/templates/display-singlespa.template.html",
      };
    },
  ])
  .config(function ($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "http://localhost:8002/assets/templates/home.template.html",
      controller: "homeController",
    })
    $routeProvider.when("/pageOne", {
      templateUrl: "http://localhost:8002/assets/templates/pageOne.template.html",
      controller: "pageOneController",
    })
    $routeProvider.when("/pageTwo", {
      templateUrl: "http://localhost:8002/assets/templates/pageTwo.template.html",
      controller: "pageTwoController",
    })
    
    ;
  })
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://localhost:8002/**'
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


//  var angularSingleSpaMain = window.singleSpaAngularjs.default({
//     angular: angular,
//     domElementGetter: function () {
//       return document.getElementById('load-main-angular-here')
//     },
//     mainAngularModule: 'AngularSingleSpaMain',
//     uiRouter: true,
//     preserveGlobal: false,
//     template: '<display-singlespa />',
//     elementId: "__single_spa_main"

//   })

  //console.log('angularSingleSpaMain',angularSingleSpaMain)

  
