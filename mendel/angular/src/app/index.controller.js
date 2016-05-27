(function() {
  'use strict';

  angular
    .module('static')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($rootScope, AuthService) {
    var vm = this;

    /*
    IndexController is used for keeping track of authentication 
    state and other app-wide information.
    */

    vm.currentUser = null;

    vm.isAuthenticated = AuthService.isAuthenticated;

    vm.currentUserWatch = $rootScope.$on('AUTH_EVENTS.loginSuccess', function setCurrentUser (user) {
      vm.currentUser = user;
      console.info('current user:', user);
    });
  }
})();