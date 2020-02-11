//(function() {
'use strict';
//http://brewhouse.io/blog/2014/12/09/authentication-made-simple-in-single-page-angularjs-applications.html
//http://jasonwatmore.com/post/2014/05/26/AngularJS-Basic-HTTP-Authentication-Example.aspx
//http://www.webdeveasy.com/angularjs-data-model/
//http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/

//polyfill of Object.assign
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

// Default environment variables
var __env = {};

// Import variables if present
if(window){
     Object.assign(__env, window.__env);
}

angular.module('app', ['ui.router','ngResource', 'nvd3', 'ngDialog', 'angular-cache', 'ui.sortable', 'ui.toggle', 'angular.filter', 'dndLists', 'ivh.treeview'])
.constant('__env', __env)
