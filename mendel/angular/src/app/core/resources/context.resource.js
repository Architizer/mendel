(function() {
  'use strict';

  angular
    .module('mendel')
    .factory('Context', function($resource, apiHost) {
      return $resource(apiHost + '/context/:id/');
  });
})();
