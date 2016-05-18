(function() {
  'use strict';

  angular
    .module('static')
    .factory('Context', function($resource) {
      return $resource('//localhost:5000/api/context/:id');
  });
})();
