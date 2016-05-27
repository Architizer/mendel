(function() {
  'use strict';

  angular
    .module('static')
    .factory('AuthService', function ($http, apiHost, Session) {
      var authService = {};
     
      authService.login = function login(credentials) {
        return $http
          .post(apiHost + '/login/', credentials)
          .then(function (res) {
            // Create a session (TBD)
            // Session.create(res.data.session, res.data.id)
          });
      };
     
      authService.isAuthenticated = function isAuthenticated() {
        return !!Session.userId;
      };
          
      return authService;
    });
  })();