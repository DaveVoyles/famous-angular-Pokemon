//'use strict';
//
//angular.module('famousAngularStarter',
//  ['ngAnimate', 'ngCookies',
//    'ngTouch', 'ngSanitize',
//    'ngResource', 'ui.router',
//    'famous.angular' ])
//  .config(function ($stateProvider, $urlRouterProvider) {
//    $stateProvider
//      .state('home', {
//        url: '/',
//        templateUrl: 'partials/main.html',
//        controller: 'MainCtrl'
//      })
//      .state('jade', {
//        url: '/jade',
//        templateUrl: 'partials/jade.html',
//        controller: 'MainCtrl'
//      });
//
//    $urlRouterProvider.otherwise('/');
//  })
//;


'use strict';

angular.module('famousAngularStarter',
  ['ngAnimate', 'ngCookies',
    'ngTouch', 'ngSanitize',
    'ngResource', 'ui.router',
    'famous.angular' ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/pokemon.html',
//        controller: 'PokemonCtrl'
      })
      .state("info", {
        url: "/info",
        templateUrl: "partials/info.html",
      })
      .state('jade', {
        url: '/jade',
        templateUrl: 'partials/jade.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
