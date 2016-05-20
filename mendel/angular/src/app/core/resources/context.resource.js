(function() {
  'use strict';

  angular
    .module('static')
    .factory('Context', function($resource, apiHost) {
      return $resource(apiHost + '/context/:id/');
  });
})();
