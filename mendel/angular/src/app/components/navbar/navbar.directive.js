(function() {
  'use strict';

  angular
    .module('mendel')
    .directive('amNavbar', amNavbar);

  /** @ngInject */
  function amNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {},
      controller: NavbarController,
      controllerAs: 'navbar',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController ($rootScope, $scope, $state, AuthService, AUTH_EVENTS, Session, toastr) {
      var vm = this;

      vm.user = {};
      vm.logout = navbarLogout;

      // Update navbar when user changes
      $scope.$watch(AuthService.isAuthenticated, updateNavbarUser);

      // Initialize Foundation on navbar
      angular.element('nav').foundation();

      function navbarLogout () {
        AuthService.logout()
        .then(logoutSuccess)
        .catch(logoutError);

        function logoutSuccess () {

          // Destroy Session
          Session.destroy();

          // Broadcast Event
          $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

          // Show Toast and Redirect
          toastr.info('Logged Out');
          $state.go('login');
        }

        function logoutError (error) {

          // Show Error Toast
          toastr.error(angular.toJson(error));
        }
      }

      function updateNavbarUser () {
        vm.user = AuthService.getCurrentUser();
      }
    }
  }
})();
