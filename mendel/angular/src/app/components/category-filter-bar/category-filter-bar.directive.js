(function() {
  'use strict';

  angular
    .module('mendel')
    .directive('amCategoryFilterBar', amCategoryFilterBar);

  /** @ngInject */
  function amCategoryFilterBar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/category-filter-bar/category-filter-bar.html',
      scope: {
        categories: '=',
        disabled: '=',
        helpCategory: '=',
        mask: '='
      },
      controller: CategoryFilterBarController,
      controllerAs: 'categoryFilterBar',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function CategoryFilterBarController ($filter, $scope) {
      var vm = this;

      vm.reset = reset;

      vm.input = '';
      vm.matches = [];
      vm.mask = false;
      vm.focus = 1; // This is a counter - see note below in focusInput()

      //
      // Watches
      //
      // Find category matches on changes to input
      $scope.$watch(angular.bind(vm, function () { return vm.input; }), findCategoryMatches);
      // Turn on overlay mask when user types into input
      $scope.$watch(angular.bind(vm, function () { return vm.input; }), setOverlayMask);
      // Clear input on changes to 'disabled' parameter
      $scope.$watch(angular.bind(vm, function () { return vm.disabled; }), clearInput);

      // Set mask
      function setOverlayMask () {
        vm.mask = (vm.input) ? true : false;
      }

      // Clear input
      function clearInput () {
        vm.input = '';
      }

      // Find category matches from vm.categories
      function findCategoryMatches () {

        // Get matches for input
        vm.matches = $filter('filter')(vm.categories, { name: vm.input });

        // Only show first four options
        if (vm.matches && vm.matches.length) { vm.matches = vm.matches.slice(0,4); }

        // If the input is cleared, show no matches
        if (!vm.input) { vm.matches = []; }
      }

      // Reset the filter (this is fired from an ng-click on any of the matching category tiles)
      function reset () {

        vm.input = '';
        vm.matches = [];
        vm.mask = false;

        focusInput();

        function focusInput () {

          /*
            I'm incrementing a counter to indicate that the input should refocus 
            since ng-focus-if uses a $watch and if we just use a boolean for "focus = true"
            it will only fire on the first change (from false --> true) and not on 
            subsequent changes (true --> true won't cause $watch to re-fire)

            See https://github.com/hiebj/ng-focus-if/issues/22#issuecomment-226221602
          */

          vm.focus++;
        }
      }
    }
  }
})();
