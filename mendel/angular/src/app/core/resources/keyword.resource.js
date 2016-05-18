(function() {
  'use strict';

  angular
    .module('static')
    .factory('Keyword', function($resource) {
      return $resource('//localhost:5000/api/keywords/:id');
  });
})();
