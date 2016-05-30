(function() {
  'use strict';

  angular
    .module('mendel')
    .factory('Keyword', function($resource, apiHost) {
      return $resource(apiHost + '/keywords/:id/');
  });
})();
