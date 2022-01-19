'use strict';
//var app = angular.module('AngularNgSingleSpa', ['ngRoute']);
var app = angular.module('AngularNgSingleSpa', []);

app.run(['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout) {
  $rootScope.loading = true;


}]);