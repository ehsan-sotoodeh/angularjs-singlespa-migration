import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from "single-spa-layout";
import { registerApplication, start } from "single-spa";

const routes = constructRoutes(document.querySelector("#single-spa-layout"), {
  loaders: {
    topNav: "<h1>Loading topnav</h1>",
  },
  errors: {
    topNav: "<h1>Failed to load topnav</h1>",
  },
});
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => System.import(name),
});
// Delay starting the layout engine until the styleguide CSS is loaded
const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});





  var angularSingleSpaMain = window.singleSpaAngularjs.default({
    angular: angular,
    domElementGetter: function () {
      return document.getElementById('load-main-angular-here')
    },
    mainAngularModule: 'AngularSingleSpaMain',
    uiRouter: true,
    preserveGlobal: false,
    template: '<display-singlespa />',
    elementId: "__single_spa_main"

  })

  var angularSingleSpaHeader = window.singleSpaAngularjs.default({
    angular: angular,
    domElementGetter: function () {
      return document.getElementById('load-header-angular-here')
    },
    mainAngularModule: 'AngularSingleSpaHeader',
    uiRouter: true,
    preserveGlobal: false,
    template: '<display-singlespa-header />',
    elementId: "__single_spa_header"

  })



  applications.push({name:'AngularSingleSpaMain', app: angularSingleSpaMain, activeWhen:function activityFunction(location) {
    return location.hash.startsWith('');
  }})
  applications.push({name:'AngularSingleSpaHeader', app: angularSingleSpaHeader, activeWhen:function activityFunction(location) {
    return location.hash.startsWith('');
  }})
  console.log('angularSingleSpaMain',angularSingleSpaMain)
  console.log('angularSingleSpaHeader',angularSingleSpaHeader)
  
  applications.forEach(registerApplication);

  

System.import("@react-mf/styleguide").then(() => {
  // Activate the layout engine once the styleguide CSS is loaded
  layoutEngine.activate();
  start();

});
