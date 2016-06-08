(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($q, $scope, AuthService, Category, Context, Review, Session, toastr) {
    var vm = this;

    vm.getContext = getContext;
    vm.getCategories = getCategories;
    vm.getNextContext = getNextContext;
    vm.getPrevContext = getPrevContext;

    // Initialize
    init();

    function init () {

      // Wait for Session to be created
      var killSessionWatcher = $scope.$watch(AuthService.isAuthenticated, function () {

        if (Session.user) {

          // Get the last Context the user reviewed
          vm.getContext(Session.user.last_context_id);

          // Get Categories
          vm.getCategories();

          // Kill this watch when we have a Session
          killSessionWatcher();
        }
      });
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
        vm.keyword = context.keyword;

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

        vm.categories = categories;
      }

      function getCategoriesError (error) {

        // Show Error Toast
        for (var i in error.data) {
          toastr.error(error.data[i], 'Error', {timeOut: 5000});
        }
      }
    }

    // Get Next Context
    function getNextContext () {

      var _nextContextId = vm.context.next_context_id;

      submitReviews()
      .then(submitReviewsSuccess)
      .catch(submitReviewsError);

      function submitReviewsSuccess (data) {

        // Show Success Toast
        toastr.success('Submitted reviews for categories: ' + data, 'Success');

        if (_nextContextId) {

          vm.getContext(_nextContextId);
        }
      }

      function submitReviewsError (error) {

        toastr.error('Could not submit reviews for categories: ' + error, 'Error');
      }
    }

    // Get Previous Context
    function getPrevContext () {

      var _prevContextId = vm.context.prev_context_id;

      // Deselect all categories
      deselectAllCategories();

      if (_prevContextId) {

        vm.getContext(_prevContextId);
      }
    }

    function deselectAllCategories () {

      angular.forEach(vm.categories, function (category) {
        category.selected = false;
      });
    }

    // Submit Reviews

    function submitReviews () {

      // Set up deferred object to return
      var deferred = $q.defer();

      // Set up promise array
      var promises = [];

      // Queue a promise for each selected category
      angular.forEach(vm.categories, function (category) {

        if (category.selected) {

          var r = {
            category: category.id,
            context: vm.context.id,
            keyword: vm.context.keyword.id,
            user: Session.user.id
          };

          var promise = Review.save(r)
          .$promise
          .then(saveReviewSuccess)
          .catch(saveReviewError);

          // Deselect the category
          category.selected = false;

          // Push promise into an array
          promises.push(promise);
        }

      });

      function saveReviewSuccess (data) {
        return data;
      }

      function saveReviewError (error) {
        return error;
      }

      // Run the queue of promises
      $q.all(promises)
      .then(promiseQueueSuccess)
      .catch(promiseQueueError);

      function promiseQueueSuccess (items) {

        var successItems = [];
        var errorItems = [];

        angular.forEach(items, function (item) {

          if (item instanceof Review) {
            successItems.push(item);
          }
          else {
            errorItems.push(item);
          }
        });

        if (errorItems.length) {
          var errorCategoryIds = [];

          // Get Category IDs for each success:
          angular.forEach(errorItems, function (errorItem) {
            errorCategoryIds.push(errorItem.config.data.category);
          });

          errorCategoryIds = errorCategoryIds.join(', ');

          deferred.reject(errorCategoryIds);
        }
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

      function promiseQueueError (error) {
        console.error('promiseQueueError:', error);

        deferred.reject('Error Submitting Reviews');
      }

      return deferred.promise;
    }


  }
})();