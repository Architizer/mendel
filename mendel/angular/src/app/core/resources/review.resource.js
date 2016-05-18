(function() {
  'use strict';

  angular
    .module('static')
    .factory('Review', function($resource) {
      return $resource('//localhost:5000/api/reviews/:id');
  });
})();
