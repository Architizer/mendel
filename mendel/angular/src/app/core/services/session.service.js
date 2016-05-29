(function() {
  'use strict';

  angular
    .module('static')
    .service('Session', function ($http, $localStorage) {

      // Update Local Storage and Authorization Header with Token
      var updateLocalStorage = function updateLocalStorage (token) {

        $localStorage._mendelToken = token;

        // Update HTTP Authorization Header
        $http.defaults.headers.common['Authorization'] = (!!token) ? 'Token ' + token : undefined;
      };

      // Create Session
      this.create = function (key, user) {

        this.user = user;
        this.token = key;

        updateLocalStorage(this.token);

        return this;
      };

      // Destroy Session
      this.destroy = function () {

        this.user = null;
        this.token = null;

        updateLocalStorage(this.token);

        return this;
      };

    });
  })();