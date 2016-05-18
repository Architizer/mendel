(function() {
  'use strict';

  angular
    .module('static')
    .factory('Keyword', function($resource) {
      return $resource('//localhost:8000/api/keywords/:id');
  });
})();
