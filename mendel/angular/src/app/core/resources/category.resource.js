(function() {
  'use strict';

  angular
    .module('static')
    .factory('Category', function($resource) {
      return $resource('//localhost:8000/api/categories/:id');
  });
})();
