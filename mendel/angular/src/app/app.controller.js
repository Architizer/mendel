(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('AppController', AppController);

  /** @ngInject */
  function AppController(AuthService, $scope, $state, AUTH_EVENTS) {
    var vm = this;

    // Watch for state changes
    $scope.$on('$stateChangeSuccess', function (event, toState) {

      // If authentication is required for the destination state
      if (toState.authenticationRequired) {

        // Get current user (to verify that user is signed in)
        AuthService.getCurrentUser();
      }
    });

    // Set up watchers for authentication issues
    $scope.$on(AUTH_EVENTS.notAuthenticated, redirectToLogin);

    function redirectToLogin () {

      $state.go('login');
    }
  }
})();