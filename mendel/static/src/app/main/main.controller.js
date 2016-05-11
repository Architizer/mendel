(function() {
  'use strict';

  angular
    .module('static')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

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
