(function() {
  'use strict';

  angular
    .module('static')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($rootScope, AUTH_EVENTS, AuthService) {
    var vm = this;

    vm.isAuthenticated = AuthService.isAuthenticated;

    vm.credentials = {
      username: '',
      password: ''
    };

    vm.submit = function submitLogin(credentials) {

      AuthService.login(credentials).then(function (user) {
        $rootScope.$emit(AUTH_EVENTS.loginSuccess, user);
      }, function () {
        $rootScope.$emit(AUTH_EVENTS.loginFailed);
      });
    };
  }
})();
