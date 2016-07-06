(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('AccountController', AccountController);

  /** @ngInject */
  function AccountController(AuthService) {
    var vm = this;

    vm.changePassword = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      submit: changePasswordSubmit,
      response: '',
      formErrors: {
        old_password: {
          error: false,
          message: null,
        },
        new_password1: {
          error: false,
          message: null,
        },
        new_password2: {
          error: false,
          message: null,
        }
      }
    };

    // Initialize Foundation on navbar
    angular.element('form').foundation();


    function changePasswordSubmit () {

      // Clear validation errors
      vm.changePassword.formErrors = {
        old_password: {
          error: false,
          message: null,
        },
        new_password1: {
          error: false,
          message: null,
        },
        new_password2: {
          error: false,
          message: null,
        }
      };

      // Clear success response
      vm.changePassword.response = '';

      // Submit request to API
      AuthService.changePassword({
        old_password: vm.changePassword.oldPassword,
        new_password1: vm.changePassword.newPassword,
        new_password2: vm.changePassword.confirmNewPassword
      })
      .then(changePasswordSuccess)
      .catch(changePasswordError);

      function changePasswordSuccess (data) {

        // Show success message
        if (data.data.hasOwnProperty('success')) {
          vm.changePassword.response = data.data['success'];
        }

        // Clear form on success
        vm.changePassword.oldPassword = '';
        vm.changePassword.newPassword = '';
        vm.changePassword.confirmNewPassword = '';

        // Blur the form
        angular.element('input').trigger('blur');
      }

      function changePasswordError (error) {

        // Show error messages for each field
        if (error.data.hasOwnProperty('old_password')) {

          vm.changePassword.formErrors.old_password.error = true;
          vm.changePassword.formErrors.old_password.message = error.data['old_password'][0];
        }
        else if (error.data.hasOwnProperty('new_password1')) {

          vm.changePassword.formErrors.new_password1.error = true;
          vm.changePassword.formErrors.new_password1.message = error.data['new_password1'][0];
        }
        else if (error.data.hasOwnProperty('new_password2')) {

          vm.changePassword.formErrors.new_password2.error = true;
          vm.changePassword.formErrors.new_password2.message = error.data['new_password2'][0];
        }
      }
    }

  }
})();
