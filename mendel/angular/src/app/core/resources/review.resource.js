(function() {
  'use strict';

  angular
    .module('mendel')
    .factory('Review', function($resource, apiHost) {
      return $resource(apiHost + '/reviews/:id/');
  });
})();
