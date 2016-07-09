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
        mask: '=',
        api: '=',
      },
      controller: CategoryFilterBarController,
      controllerAs: 'categoryFilterBar',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function CategoryFilterBarController ($filter, $scope) {
      var vm = this;

      vm.handle = handle;

      vm.input = '';
      vm.matches = [];
      vm.mask = false;
      vm.focusInput = 1; // This is a counter - see note below in focusInput()
      vm.focusIndex = 0;

      vm.api = {
        focusInput: focusInput,
      };


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

        vm.focusIndex = 0;
      }

      // Reset the filter
      function reset () {

        vm.input = '';
        vm.matches = [];
        vm.mask = false;
        vm.focusIndex = 0;
      }

      // Refocus the input
      function focusInput () {

        /*
          I'm incrementing a counter to indicate that the input should refocus 
          since ng-focus-if uses a $watch and if we just use a boolean for "focus = true"
          it will only fire on the first change (from false --> true) and not on 
          subsequent changes (true --> true won't cause $watch to re-fire)

          See https://github.com/hiebj/ng-focus-if/issues/22#issuecomment-226221602
        */

        vm.focusInput++;
      }

      // Event handler function for toggling selection on category matches (for when user clicks or uses Tab key to select)
      function handle (e) {

        // Get the category of the target
        var category = angular.element(e.target).scope().category;
        if (!category) { return; }

        // If user uses keyboard to select a category tile
        if (e.keyCode) {

          // If Enter key or Spacebar
          if (e.keyCode == 13 || e.keyCode == 32) {

            // Toggle category "selected"
            category.selected = !category.selected;
          }
        }

        // Reset the filter bar and refocus the input
        reset();
        focusInput();
      }

      // Handle Up Arrow/Down Arrow/Enter key inputs while the text input is focused
      angular.element('input#categoryFilterBar').keyup(function (e) {

        //
        // Set up category targeting
        //
        var category;

        function focusCategory () {

          // Find the category in the list of matches
          var element = angular.element('#match-category-tile-' + vm.focusIndex);

          // If a matching element is found, get the category from this element's scope
          if (element[0]) {
            category = element.scope().category;
          }

          // Trigger fake mouseenter on the element to show the category's description in "Help" panel
          element.trigger("mouseenter");
        }

        //
        // Handle key presses
        //
        // Up arrow key: get previous match
        if (e.keyCode == 38) {
          if (vm.focusIndex > 0) {
            vm.focusIndex--;
          }
          else {
            vm.focusIndex = 0;
          }
        }

        // Down arrow key: get next match
        if (e.keyCode == 40) {
          if ((vm.focusIndex) < (vm.matches.length - 1)) { 
            vm.focusIndex++;
          }
        }

        // (Focus the category)
        focusCategory();

        // Enter key: select currently-hovered category
        if (e.keyCode == 13 && category) {

          // Select/unselect the category
          category.selected = !category.selected;

          // Reset the filter bar and refocus the input
          reset();
          focusInput();

          // $scope.$apply() because Angular, mreh
          $scope.$apply();
        }

        // Escape key: reset the input
        if (e.keyCode == 27) {

          // Reset the filter bar and refocus the input
          reset();
          focusInput();

          // $scope.$apply() because Angular, mreh
          $scope.$apply();
        }

      });
    }
  }
})();
