(function() {
  'use strict';

  angular
    .module('static')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Category, Context, Review, toastr) {
    var vm = this;

    vm.selected = {};
    vm.selected = [];

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

    // Toggle Category
    vm.toggleCategory = function toggleCategory(event, category) {

      var element = angular.element(event.target);

      // Get index of category in selected array
      var index = vm.selected.indexOf(category);

      if (index !== -1) {

        vm.selected.splice(index, 1);
        element.addClass('hollow');
      }
      else {

        vm.selected.push(category);
        element.removeClass('hollow');
      }
    };

    // Create Review
    vm.saveReview = function saveReview(category, context) {

      Review.save({
        category: category.id,
        context: context.id,
        keyword: context.keyword.id,
        user: 1,
      }, function (review) {
        toastr.success('Category <strong>' + category.name + '</strong> added to Keyword <strong>' + context.keyword.name + '</strong>');
      }, function (error) {
        toastr.error('There was an error: ' + JSON.stringify(error), {timeOut: 5000});
      });
    };

  }
})();