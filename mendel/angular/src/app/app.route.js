(function() {
  'use strict';

  angular
    .module('mendel')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main/?context',
        templateUrl: 'app/main/main.html',
        reloadOnSearch : false,
        controller: 'MainController',
        controllerAs: 'main'
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

      ;

    $urlRouterProvider.otherwise('/main');
  }

})();
