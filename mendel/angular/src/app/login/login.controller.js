(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($rootScope, $state, AuthService, AUTH_EVENTS, Session, toastr) {
    var vm = this;

    vm.submit = submitLogin;

    vm.credentials = {
      username: '',
      password: '',
    };

    function submitLogin(credentials) {

      AuthService.login(credentials)
      .then(submitLoginSuccess)
      .catch(submitLoginError);

      function submitLoginSuccess (data) {

        // Deserialize the return:
        var key = data.data.key;
        var user = data.data.user;

        // Create Session
        Session.create(key, user);

        // Broadcast event
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

        // Show Success Toast and Redirect
        toastr.success('Logged In');
        $state.go('main');

        return user;
      }

      function submitLoginError (error) {

        // Broadcast event
        $rootScope.$broadcast(AUTH_EVENTS.loginFailure);

        // Show Error Toast
        for (var i in error.data) {
          toastr.error(error.data[i][0], 'Login Error');
        }
      }
    }

  }
})();
