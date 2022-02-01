
var kaizenSingleSpaApp = singleSpaAngularjs.default({
  angular: window.angular,
  domElementGetter: function () {
    return document.getElementById('load-angular-here')
  },
  mainAngularModule: 'AngularSingleSpa',
  uiRouter: false,
  preserveGlobal: true,
  template: '<display-singlespa />',
})

singleSpa.registerApplication('kaizen-ng-single-spa', kaizenSingleSpaApp, function activityFunction(location) {
  return location.hash.startsWith('');
})


singleSpa.start()

