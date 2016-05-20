(function() {
  'use strict';

  angular
    .module('static')
    .factory('Review', function($resource, apiHost) {
      return $resource(apiHost + '/reviews/:id/');
  });
})();
