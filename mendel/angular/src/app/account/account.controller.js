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
    vm.changePassword.submit = changePasswordSubmit;
    vm.changePassword.response = '';


    function changePasswordSubmit () {

      AuthService.changePassword({
        old_password: vm.changePassword.oldPassword,
        new_password1: vm.changePassword.newPassword,
        new_password2: vm.changePassword.confirmNewPassword
      })
      .then(changePasswordSuccess)
      .catch(changePasswordError);

      function changePasswordSuccess (data) {

        vm.changePassword.response = data;
      }

      function changePasswordError (error) {

        vm.changePassword.response = error;
      }
    }

  }
})();
