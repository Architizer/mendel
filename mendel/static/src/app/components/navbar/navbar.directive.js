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
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController() {
      var vm = this;

      // Initialize Foundation on navbar
      angular.element('nav').foundation();
    }
  }

})();
