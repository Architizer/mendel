(function() {
  'use strict';

  angular
    .module('static')
    .service('apiInterceptor', apiInterceptor);

    /** @ngInject */
    function apiInterceptor ($q, $rootScope, AUTH_EVENTS) {

      return {
        responseError: responseError
      };

      function responseError (response) {

        switch (response.status) {

          // Not Authenticated
          case 401:
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            break;
        }

        return $q.reject(response);
      };
    }
  })();
