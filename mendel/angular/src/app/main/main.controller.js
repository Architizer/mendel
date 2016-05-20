(function() {
  'use strict';

  angular
    .module('static')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Category, Context, Review, toastr) {
    var vm = this;

    // Get Context
    Context.get({
      id: 1
    }, function (context) {
        vm.context = context;
        vm.context.front = '"...' + vm.context.text.substring(0, vm.context.position_from);
        vm.context.back = vm.context.text.substring(vm.context.position_to, vm.context.text.length) + '..."';
        vm.keyword = context.keyword;
    }, function (error) {
        toastr.error('There was an error:' + JSON.stringify(error), {timeOut: 5000});
    });

    // Get Categories
    Category.query(function (categories) {

      vm.categories = categories;
    });

    // Submit Reviews
    vm.getNextContext = function getNextContext (context) {

      angular.forEach(vm.categories, function(category) {

        if (category.selected) {

          Review.save({
            category: category.id,
            context: context.id,
            keyword: context.keyword.id,
            user: 1
          }, function saveReviewSuccess (review) {
            // Show Toastr Success
            toastr.success('Category <strong>' + review.category + '</strong> added to Keyword <strong>' + review.keyword + '</strong>');
            // Unselect the category
            category.selected = false;
          }, function saveReviewError (error) {
            // Show Toastr Error
            toastr.error('There was an error: ' + JSON.stringify(error), {timeOut: 5000});
          });
        }
      });
    };
  }
})();