(function() {
  'use strict';

  angular
    .module('static')
    .factory('Keyword', function($resource, apiHost) {
      return $resource(apiHost + '/api/keywords/:id');
  });
})();
