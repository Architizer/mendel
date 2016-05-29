(function() {
  'use strict';

  angular
    .module('static')
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
    function NavbarController ($scope, AuthService) {
      var vm = this;

      vm.user = {};
      vm.logout = navbarLogout;

      // Update navbar when user changes
      $scope.$watch(AuthService.isAuthenticated, updateNavbarUser);

      // Initialize Foundation on navbar
      angular.element('nav').foundation();

      function navbarLogout () {
        AuthService.logout();
      }

      function updateNavbarUser () {
        vm.user = AuthService.getCurrentUser();
      }
    }
  }
})();
