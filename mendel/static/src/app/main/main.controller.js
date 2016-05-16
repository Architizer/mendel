(function() {
  'use strict';

  angular
    .module('static')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    vm.keyword = 'Europe';

    vm.context = {};

    vm.context.front = '"...the westernmost part of Eurasia.';
    vm.context.back = 'is bordered by the Arctic Ocean to the north, the Atlantic Ocean to ..."';

    vm.definition = '"a continent that comprises the westernmost part of Eurasia."';

    vm.categories = [
      'Aesthetic Concepts',
      'Architect Name',
      'Architectural Element',
      'Architectural Style',
      'Building Type',
      'City',
      'Color',
      'Continent',
      'Country',
      'Finish',
      'Firm Name',
      'Manufacturer Name',
      'Material',
      'Performance Concepts',
      'Price Concepts',
      'Product Type',
      'Room/Space Type',
      'State',
      'Unit'
    ];
  }
})();
