(function() {
  'use strict';

  angular
    .module('static')
    .factory('Review', function($resource) {
      return $resource('//localhost:8000/api/reviews/:id');
  });
})();
