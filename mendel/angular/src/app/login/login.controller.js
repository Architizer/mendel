(function() {
  'use strict';

  angular
    .module('static')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController(AuthService) {
    var vm = this;

    vm.submit = submitLogin;

    vm.credentials = {
      username: '',
      password: ''
    };

    function submitLogin(credentials) {
      AuthService.login(credentials);
    }

  }
})();
