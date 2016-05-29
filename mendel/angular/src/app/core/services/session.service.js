(function() {
  'use strict';

  angular
    .module('static')
    .service('Session', Session);

    /** @ngInject */
    function Session ($http, $localStorage) {

      // Create Session
      this.create = function createSession (key, user) {

        this.user = user;
        this.token = key;

        updateLocalStorage(this.token);

        return this;
      };

      // Destroy Session
      this.destroy = function destroySession () {

        this.user = null;
        this.token = null;

        updateLocalStorage(this.token);

        return this;
      };

      // Update Local Storage and Authorization Header with Token
      function updateLocalStorage (token) {

        $localStorage._mendelToken = token;

        // Update HTTP Authorization Header
        $http.defaults.headers.common['Authorization'] = (!!token) ? 'Token ' + token : undefined;
      }
    }
  })();