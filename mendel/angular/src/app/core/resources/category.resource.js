(function() {
  'use strict';

  angular
    .module('static')
    .factory('Category', function($resource) {
      return $resource('//localhost:5000/api/categories/:id');
  });
})();
