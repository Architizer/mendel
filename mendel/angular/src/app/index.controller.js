(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($scope, $state, AUTH_EVENTS) {
    var vm = this;

    // Set up watchers for authentication issues
    $scope.$on(AUTH_EVENTS.notAuthenticated, redirectToLogin);

    function redirectToLogin () {

      $state.go('login');
    }
  }
})();