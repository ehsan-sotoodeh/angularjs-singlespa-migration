var kaizenSingleSpaApp = window.singleSpaAngularjs.default({
  angular: window.angular,
  domElementGetter: function () {
    return document.getElementById('load-angular-here')
  },
  mainAngularModule: 'AngularSingleSpa',
  uiRouter: false,
  preserveGlobal: true,
  template: '<display-singlespa />',
})


window.singleSpa.registerApplication('kaizen-ng-single-spa', kaizenSingleSpaApp, function activityFunction(location) {
  return location.hash.startsWith('');
})


window.singleSpa.start()

