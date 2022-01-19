'use strict';

angular
.module('AngularNgSingleSpa')
.directive('displaySinglespa', [function() {
  return {
    restrict: 'E',
    templateUrl: 'assets/templates/display-singlespa.template.html',
  }
}])