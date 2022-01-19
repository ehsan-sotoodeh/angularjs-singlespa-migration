'use strict';

angular
.module('AngularNgSingleSpa')
.directive('displayMachine', [function() {
  return {
    restrict: 'E',
    templateUrl: 'assets/templates/display-machine.template.html',
  }
}])