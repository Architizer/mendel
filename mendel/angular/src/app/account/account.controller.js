(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('AccountController', AccountController);

  /** @ngInject */
  function AccountController(AuthService) {
    var vm = this;

    vm.changePassword = {};

    vm.changePassword.oldPassword = '';
    vm.changePassword.newPassword = '';
    vm.changePassword.confirmNewPassword = '';

  }
})();
