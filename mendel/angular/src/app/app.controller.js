(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('AppController', AppController);

  /** @ngInject */
  function AppController($scope, $state, AUTH_EVENTS) {
    var vm = this;

    // Set up watchers for authentication issues
    $scope.$on(AUTH_EVENTS.notAuthenticated, redirectToLogin);

    function redirectToLogin () {

      $state.go('login');
    }
  }
})();