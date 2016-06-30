(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($q, $scope, AuthService, Category, Context, hotkeys, Keyword, Review, Session, toastr) {
    var vm = this;

    vm.getNextContext = getNextContext;
    vm.getPrevContext = getPrevContext;
    vm.toggleSpecialCategory = toggleSpecialCategory;
    vm.editKeyword = editKeyword;
    vm.saveKeyword = saveKeyword;

    // Initialize
    init();

    function init () {

      // Wait for Session to be created
      var killSessionWatcher = $scope.$watch(AuthService.isAuthenticated, function () {

        if (Session.user) {

          // Get Categories
          getCategories()
          .then(function(categories) {
            // Put regular categories in view
            vm.categories = categories;
          });

          // Get the last Context the user reviewed
          getContext(Session.user.last_context_id);

          // Kill this watch when we have a Session
          killSessionWatcher();
        }
      });

      // Set up hotkeys
      hotkeys.bindTo($scope)
      .add({
        combo: [
          'command+left', 
          'command+backspace',
          'ctrl+left',
          'ctrl+backspace',
          'shift+left',
          'shift+backspace',
        ],
        allowIn: ['INPUT'],
        description: 'Get the previous context',
        callback: getPrevContext
      })
      .add({
        combo: [
          'command+right',
          'command+enter',
          'ctrl+right',
          'ctrl+enter',
          'shift+right',
          'shift+enter',
        ],
        allowIn: ['INPUT'],
        description: 'Get the next context',
        callback: getNextContext
      })
      .add({
        combo: [
          'left',
        ],
        description: 'Get the previous context',
        callback: getPrevContext
      })
      .add({
        combo: [
          'right',
        ],
        description: 'Get the next context',
        callback: getNextContext
      })
      ;
    }

    // Controller Functions

    // Get Context
    function getContext (id) {

      Context.get({id: id})
      .$promise
      .then(getContextSuccess)
      .catch(getContextError);

      function getContextSuccess (context) {

        vm.context = context;
        vm.keyword = angular.copy(context.keyword_given);
        vm.context.previouslySelectedCategories = preselect();

        function preselect () {
          var _prevCategories = [];

          // Load previously-selected categories
          angular.forEach(context.user_reviews, function(review){
            _prevCategories.push(review.category);
          });

          // Loop through categories, set "selected" if in prevously selected categories for context
          angular.forEach(vm.categories, function(category) {
            if (_prevCategories.indexOf(category.id) !== -1) {
              category.selected = true;
            }

            // Handle special categories
            if (_prevCategories.indexOf(vm.deleteCategory.id) !== -1) {
              vm.toggleSpecialCategory('delete');
            }
            else if (_prevCategories.indexOf(vm.idkCategory.id) !== -1) {
              vm.toggleSpecialCategory('idk');
            }
          });

          return _prevCategories;
        }

        return context;
      }

      function getContextError (error) {

        // Show Error Toast
        for (var i in error.data) {
          toastr.error(error.data[i], 'Error', {timeOut: 5000});
        }
      }
    }

    // Get Categories
    function getCategories () {

      // Set up deferred object to return
      var deferred = $q.defer();

      // Get categories
      Category.query()
      .$promise
      .then(getCategoriesSuccess)
      .catch(getCategoriesError);

      function getCategoriesSuccess (categories) {

        // Set up special categories
        vm.deleteCategory = null;
        vm.idkCategory = null;

        // Find special categories
        angular.forEach(categories, function (category) {

          /*
            TODO: 
            Find another way to select the special categories.

            Currently, we're just searching for the categories
            with the names "Delete" and "I don't know" 

            Additionally, it'd be nice if the special categories 
            were protected from accidental (or intentional) deletion 
            in the database/back end.
          */

          // Find the "Delete" category
          if (category.name === 'Delete') {
            vm.deleteCategory = category;
          }

          // Find the "I don't know" category
          if (category.name === 'I don\'t know') {
            vm.idkCategory = category;
          }

        });

        // Take special categories out of the mix of regular categories
        categories.splice(categories.indexOf(vm.deleteCategory), 1);
        categories.splice(categories.indexOf(vm.idkCategory), 1);

        // Resolve the promise with the categories
        return deferred.resolve(categories);

      }

      function getCategoriesError (error) {

        // Show Error Toast
        for (var i in error.data) {
          toastr.error(error.data[i], 'Error', {timeOut: 5000});
        }

        // Reject the promise
        return deferred.reject(error);
      }

      // Return the promise
      return deferred.promise;
    }

    // Edit Keyword
    function editKeyword () {

      vm.editingKeyword = true;

      vm.newKeyword = {
        name: vm.keyword.name
      };

    }

    // Save New Keyword
    function saveKeyword () {

      vm.editingKeyword = false;

      vm.keyword = vm.newKeyword;
    }

    // Get Next Context
    function getNextContext () {

      var _nextContextId = vm.context.next_context_id;

      if (_nextContextId) {

        // Deselect all categories
        deselectAllCategories();

        // Reset special categories
        resetSpecialCategories();

        getContext(_nextContextId);
      }
    }

    // Get Previous Context
    function getPrevContext () {

      var _prevContextId = vm.context.prev_context_id;

      if (_prevContextId) {
  
        // Deselect all categories
        deselectAllCategories();

        // Reset special categories
        resetSpecialCategories();

        getContext(_prevContextId);
      }
    }

    // Deselect All Categories
    function deselectAllCategories () {

      angular.forEach(vm.categories, function (category) {
        category.selected = false;
      });
    }

    // Reset special categories ("Delete" / "I don't know")
    function resetSpecialCategories () {

      // Unselect special categories
      vm.deleteCategory.selected = false;
      vm.idkCategory.selected = false;

      // Unblur regular categories
      vm.specialCategorySelected = false;
    }

    // Select a special category ("Delete / "I don't know")
    function toggleSpecialCategory (modeClicked) {

      // Begin by resetting special category selections
      vm.deleteCategory.selected = false;
      vm.idkCategory.selected = false;

      // Next, check if we are unclicking the currently-selected special category
      if (vm.specialCategorySelected && vm.specialCategorySelected === modeClicked) {

        resetSpecialCategories();

        return;
      }

      // Otherwise, turn on special category mode
      else {

        // "Delete" Mode
        if (modeClicked === 'delete') {

          // Blur regular categories
          vm.specialCategorySelected = 'delete';
          vm.deleteCategory.selected = true;
        }

        // "I don't know" Mode
        if (modeClicked === 'idk') {

          // Blur regular categories
          vm.specialCategorySelected = 'idk';
          vm.idkCategory.selected = true;
        }

        // Unselect all regular categories when in special category mode
        angular.forEach(vm.categories, function(category) {
          if (category.selected) {
            category.selected = false;
          }
        });
      }
    }

  }
})();