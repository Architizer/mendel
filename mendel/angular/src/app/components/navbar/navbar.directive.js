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
    function NavbarController($scope, AuthService, $state, toastr) {
      var vm = this;

      vm.logout = function navbarLogout () {
        AuthService.logout();
      };

      // Initialize Foundation on navbar
      angular.element('nav').foundation();
    }
  }

})();
