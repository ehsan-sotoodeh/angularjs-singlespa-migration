'use strict';

angular
.module('AngularSingleSpa')
.directive('displaySinglespa', [function() {
  return {
    restrict: 'E',
    templateUrl: 'assets/templates/display-singlespa.template.html',
  }
}])