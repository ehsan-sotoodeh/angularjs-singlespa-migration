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
  return location.hash.startsWith('#/singlespa');
})

var helloWorldApp = {
  bootstrap: function() {
    return Promise.resolve()
  },
  mount: function() {
    return Promise.resolve().then(function() {
      alert('hello world')
    })
  },
  unmount: function() {
    return Promise.resolve()
  },
}
window.singleSpa.registerApplication('hello-world', helloWorldApp, function activityFunction(location) {
  return location.hash.startsWith('#/hello');
})

window.singleSpa.start()