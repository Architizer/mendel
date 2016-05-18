(function() {
  'use strict';

  angular
    .module('static')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Category, Context) {
    var vm = this;

    // Get Context
    Context.get({id: 1}, function (context) {

      vm.context = context;
      vm.context.front = '"...' + vm.context.text.substring(0, vm.context.position_from);
      vm.context.back = vm.context.text.substring(vm.context.position_to, vm.context.text.length) + '..."';
      vm.keyword = context.keyword;
    });

    // Get Categories
    Category.query(function (categories) {

      vm.categories = categories;
    });

  }
})();