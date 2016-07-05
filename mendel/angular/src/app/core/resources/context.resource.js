(function() {
  'use strict';

  angular
    .module('mendel')
    .factory('Context', function($resource, apiHost) {
      return $resource(apiHost + '/context/:id/',
      null,
      {
        'submitReviews': {
          method: 'POST',
          params: { id: '@id' },
          url: apiHost + '/context/:id/reviews/'}
      });
  });
})();
