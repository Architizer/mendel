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
          getCategories();

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
        vm.context.front = '"...' + vm.context.text.substring(0, vm.context.position_from);
        vm.context.back = vm.context.text.substring(vm.context.position_to, vm.context.text.length) + '..."';
        vm.keyword = angular.copy(context.keyword_given);
        vm.context.previouslySelectedCategories = preselect();

        function preselect () {
          var _prevCategories = [];

          // Load previously-selected categories
          angular.forEach(context.reviews, function(review){
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

        // Put regular categories in view
        vm.categories = categories;

      }

      function getCategoriesError (error) {

        // Show Error Toast
        for (var i in error.data) {
          toastr.error(error.data[i], 'Error', {timeOut: 5000});
        }
      }
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

      // If we haven't changed the keyword, don't bother saving
      if (vm.newKeyword.name === vm.keyword.name) {
        return;
      }

      // POST to the Keywords endpoint to get_or_create the Keyword
      Keyword.save({
        name: vm.newKeyword.name
      })
      .$promise
      .then(saveKeywordSuccess)
      .catch(saveKeywordError);

      function saveKeywordSuccess (data) {

        // Set flag for when user goes to next context
        vm.updatedKeyword = true;

        // Reset vm.keyword
        vm.keyword = data;
      }

      function saveKeywordError (error) {

        // Reset Keyword to Context's Original Keyword
        vm.keyword = vm.context.keyword_given;

        // Show Error Toast
        for (var i in error.data) {
          toastr.error(JSON.stringify(error.data[i]), 'Error', {timeOut: 5000});
        }
      }
    }

    // Get Next Context
    function getNextContext () {

      var _nextContextId = vm.context.next_context_id;

      if (vm.context.keyword_given) {

        submitReviews()
        .then(submitReviewsSuccess)
        .catch(submitReviewsError);
      }

      function submitReviewsSuccess (successCategoryIds) {

        if (successCategoryIds) {

          // Show Success Toast
          toastr.success('Added categories to ' + vm.context.keyword_given.name);
        }
        else {

          // Show Success Toast
          toastr.success('Updated categories for ' + vm.context.keyword_given.name);
        }

        // Deselect all categories
        deselectAllCategories();

        // Reset special categories
        resetSpecialCategories();

        if (_nextContextId) {

          getContext(_nextContextId);
        }
        else {

          var _prevContextId = angular.copy(vm.context.id);

          // Empty Context
          vm.context = {};
          vm.keyword = null;
          vm.context.prev_context_id = _prevContextId;
        }
      }

      function submitReviewsError (errorCategoryIds) {

        toastr.error('Could not submit reviews for category IDs: ' + errorCategoryIds, 'Error');
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

    // Submit Reviews
    function submitReviews () {

      /*
        Check if user has changed keyword
        - if yes:
          - unselect any previously selected keywords
          - reselect any previously-selected categories from this context
      */

      // Set up deferred object to return
      var deferred = $q.defer();

      // Set up promise array
      var promises = [];

      // Set up arrays of categories
      var currentlySelected = [],   // (IDs of currently selected categories, raw from the form)
          currentlyUnselected = [], // (IDs of currently unselected categories, raw from the form)
          existingReviews = [],     // (IDs of existing reviews for this context)
          previouslySelected = [],  // OMIT each   (vm.categories[selected] is included in context.reviews)
          newlySelected = [],       // SAVE each   (vm.categories[selected] is not included in context.reviews)
          newlyUnselected = [],     // DELETE each (vm.categories[!selected] is included in context.reviews)
          reviewsToDelete = [];     // (IDs of reviews to be deleted)

      constructArrays();

      function constructArrays () {

        // Handle special categories
        if (vm.specialCategorySelected) {

          if (vm.specialCategorySelected === 'delete') {
            currentlySelected.push(vm.deleteCategory.id);
            currentlyUnselected.push(vm.idkCategory.id);
          }

          else if (vm.specialCategorySelected === 'idk') {
            currentlySelected.push(vm.idkCategory.id);
            currentlyUnselected.push(vm.deleteCategory.id);
          }
        }

        // Otherwise, special categories aren't selected
        else {
          currentlyUnselected.push(vm.deleteCategory.id);
          currentlyUnselected.push(vm.idkCategory.id);           
        }

        // Construct currentlySelected and currentlyUnselected arrays
        angular.forEach(vm.categories, function (category) {
          if (category.selected) {
            currentlySelected.push(category.id);
          }
          if (!category.selected) {
            currentlyUnselected.push(category.id);
          }
        });

        // Construct previouslySelected array ()
        angular.forEach(vm.context.reviews, function(review) {
          previouslySelected.push(review.category);
          existingReviews.push(review.id);
        });

        // Construct newlySelected array
        angular.forEach(currentlySelected, function(categoryId) {
          if (previouslySelected.indexOf(categoryId) === -1) {
            newlySelected.push(categoryId);
          }
        });

        // Construct newlyUnselected array
        angular.forEach(currentlyUnselected, function (categoryId) {
          if (previouslySelected.indexOf(categoryId) !== -1) {
            newlyUnselected.push(categoryId);
          }
        });

        // Construct reviewsToDelete array
        angular.forEach(vm.context.reviews, function(review) {
          if (newlyUnselected.indexOf(review.category) !== -1) {
            reviewsToDelete.push(review.id);
          }
        });
      }


      // Queue a promise to save each newly selected category
      angular.forEach(newlySelected, function (categoryId) {

        // Construct Review object
        var r = {
          category: categoryId,
          context: vm.context.id,
          keyword_given: vm.context.keyword_given.id,
          keyword_proposed: vm.keyword.id,
          user: Session.user.id
        };

        var promise = Review.save(r)
        .$promise
        .then(saveReviewSuccess)
        .catch(saveReviewError);

        // Push promise into array
        promises.push(promise);

      });

      // Queue a promise to delete each newly unselected category
      angular.forEach(reviewsToDelete, function (reviewId) {

        var promise = Review.delete({id: reviewId})
        .$promise
        .then(deleteReviewSuccess)
        .catch(deleteReviewError);

        // Push promise into array
        promises.push(promise);

      });

      // (Callbacks)
      function saveReviewSuccess (data) { return data; }
      function saveReviewError (error) { return error; }
      function deleteReviewSuccess (data) { return data; }
      function deleteReviewError (error) { return error; }



      // Run the queue of promises
      $q.all(promises)
      .then(promiseQueueSuccess)
      .catch(promiseQueueError);

      // (Callbacks)
      function promiseQueueSuccess (items) {

        var successItems = [];
        var errorItems = [];

        angular.forEach(items, function (item) {

          // If the item is a Review item, push to success array
          if (item instanceof Review) {
            successItems.push(item);
          }
          // Otherwise, it is an Error item, push to error array
          else {
            errorItems.push(item);
          }
        });

        // If there are any review errors, return IDs of categories that failed, and reject promise
        if (errorItems.length) {
          var errorCategoryIds = [];

          // Get Category IDs for each success:
          angular.forEach(errorItems, function (errorItem) {
            errorCategoryIds.push(errorItem.config.data.category);
          });

          errorCategoryIds = errorCategoryIds.join(', ');

          deferred.reject(errorCategoryIds);
        }

        // Otherwise, return IDs of successful categories, and resolve promise
        else {
          var successCategoryIds = [];

          // Get Category IDs for each success:
          angular.forEach(successItems, function (successItem) {
            successCategoryIds.push(successItem.category);
          });

          successCategoryIds = successCategoryIds.join(', ');

          deferred.resolve(successCategoryIds);
        }

      }

      // If there are other errors with the $q.all(), return error and reject promise
      function promiseQueueError (error) {
        console.error('promiseQueueError:', error);

        deferred.reject('Error Submitting Reviews');
      }

      return deferred.promise;
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