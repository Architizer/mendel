(function() {
  'use strict';

  angular
    .module('mendel')
    .service('apiInterceptor', apiInterceptor);

    /** @ngInject */
    function apiInterceptor ($localStorage, $q, $rootScope, AUTH_EVENTS) {

      return {
        request: request,
        responseError: responseError
      };

      function request (config) {

        // Set Authorization Header with Token from Local Storage
        config.headers['Authorization'] = ($localStorage._mendelToken) ? 'Token ' + $localStorage._mendelToken : undefined;

        return config;
      }

      function responseError (response) {

        switch (response.status) {

          // Not Authenticated
          case 401:
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            break;
        }

        return $q.reject(response);
      }
    }
  })();
