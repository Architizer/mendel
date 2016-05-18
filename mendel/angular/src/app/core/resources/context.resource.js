(function() {
  'use strict';

  angular
    .module('static')
    .factory('Context', function($resource) {
      return $resource('//localhost:8000/api/context/:id');
  });
})();
