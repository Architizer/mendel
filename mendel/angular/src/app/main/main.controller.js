(function() {
  'use strict';

  angular
    .module('static')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Category, Keyword) {
    var vm = this;

    vm.keyword = Keyword.get({id: 1});

    vm.context = {};

    vm.context.front = '"...the westernmost part of Eurasia.';
    vm.context.back = 'is bordered by the Arctic Ocean to the north, the Atlantic Ocean to ..."';

    vm.definition = '"a continent that comprises the westernmost part of Eurasia."';

    vm.categories = Category.query();

  }
})();
