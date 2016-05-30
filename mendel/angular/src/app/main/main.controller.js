(function() {
  'use strict';

  angular
    .module('static')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Category, Context, Review, Session, toastr) {
    var vm = this;

    vm.getContext = getContext;
    vm.getCategories = getCategories;
    vm.getNextContext = getNextContext;

    // Initialize
    vm.getContext();
    vm.getCategories();



    // Get Context
    function getContext () {

      Context.get({id: 1})
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

      submitReviews();
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