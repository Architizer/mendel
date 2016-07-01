(function() {
  'use strict';

  angular
    .module('mendel')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        authenticationRequired: true
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'app/about/about.html',
        controller: 'AboutController',
        controllerAs: 'about'
      })

      .state('account', {
        url: '/account',
        templateUrl: 'app/account/account.html',
        controller: 'AccountController',
        controllerAs: 'account',
        authenticationRequired: true
      })

      ;

    $urlRouterProvider.otherwise('/main');
  }

})();
