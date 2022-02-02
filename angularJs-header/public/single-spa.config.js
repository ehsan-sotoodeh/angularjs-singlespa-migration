
var angularSingleSpaHeader = window.singleSpaAngularjs.default({
  angular: window.angular,
  domElementGetter: function () {
    return document.getElementById('load-angular-here')
  },
  mainAngularModule: 'angularSingleSpaHeader',
  uiRouter: false,
  preserveGlobal: true,
  template: '<display-singlespa-header />',
})

// singleSpa.registerApplication('angularjs3', kaizenSingleSpaApp, function activityFunction(location) {
//   return location.hash.startsWith('');
// })


// singleSpa.start()

