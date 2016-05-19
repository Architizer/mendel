(function() {
  'use strict';

  angular
    .module('static')
    .factory('Category', function($resource, apiHost) {
      return $resource(apiHost + '/api/categories/:id');
  });
})();
