(function() {
  'use strict';

  angular
    .module('mendel')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, AuthService, Category, Context, Review, Session, toastr) {
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

      if (_nextContextId) {

        vm.getContext(_nextContextId);
      }

      // submitReviews();
    }

    // Get Previous Context
    function getPrevContext () {

      var _prevContextId = vm.context.prev_context_id;

      if (_prevContextId) {

        vm.getContext(_prevContextId);
      }
    }

    // Submit Reviews
    function submitReviews () {

      angular.forEach(vm.categories, function(category) {

        if (category.selected) {

          var r = {
            category: category.id,
            context: vm.context.id,
            keyword: vm.context.keyword.id,
            user: Session.user.id
          };

          Review.save(r)
          .$promise
          .then(submitReviewSuccess)
          .catch(submitReviewError);

        }

        function submitReviewSuccess (review) {

          var successMessage = 'Category <strong>' + review.category + '</strong> added to Keyword <strong>' + review.keyword + '</strong>';

          // Show Toastr Success
          toastr.success(successMessage, 'Category Added');
          // Unselect the category
          category.selected = false;
        }

        function submitReviewError (error) {

          // Show Error Toast
          for (var i in error.data) {
            toastr.error(error.data[i][0], 'Error', {timeOut: 5000});
          }
        }
      });
    }
  }
})();