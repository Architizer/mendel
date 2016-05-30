(function() {
  'use strict';

  angular
    .module('mendel')
    .factory('Category', function($resource, apiHost) {
      return $resource(apiHost + '/categories/:id/');
  });
})();
