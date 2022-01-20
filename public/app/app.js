'use strict';
//var app = angular.module('AngularSingleSpa', ['ngRoute']);
var app = angular.module('AngularSingleSpa', []);

app.run(['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout) {
  $rootScope.loading = true;


}]);