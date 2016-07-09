(function() {
  'use strict';

  angular
    .module('mendel')
    .factory('AuthService', AuthService);

    /** @ngInject */
    function AuthService ($rootScope, $http, $httpParamSerializerJQLike, $localStorage, AUTH_EVENTS, apiHost, Session, toastr) {

      return {
        login: login,
        logout: logout,
        getCurrentUser: getCurrentUser,
        isAuthenticated: isAuthenticated,
        changePassword: changePassword,
      };

      function isAuthenticated () {

        return !!Session.user;
      }

      function login (credentials) {

        return $http({
          method: 'POST',
          url: apiHost + '/login/',
          data: $httpParamSerializerJQLike(credentials),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        });
      }

      function logout () {

        // Construct payload for sending token back with logout
        var payload = {
          token: Session.token,
        };

        return $http({
          method: 'POST',
          url: apiHost + '/logout/',
          data: $httpParamSerializerJQLike(payload),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        });
      }

      function getCurrentUser () {

        // First, check if there's an existing Session
        if (Session.user) {

          // Broadcast Event
          $rootScope.$broadcast(AUTH_EVENTS.getCurrentUserSuccess);

          // Yes? Return this user
          return Session.user;
        }

        // If no, check if there's a token to retrieve the user
        else if ($localStorage._mendelToken) {

          // Set Authorization Header with Token
          $http.defaults.headers.common['Authorization'] = 'Token ' + $localStorage._mendelToken;

          // Get User info from endpoint
          $http({
            method: 'GET',
            url: apiHost + '/user/',
          })
          .then(getCurrentUserSuccess)
          .catch(getCurrentUserError);
        }

        // Otherwise, we're not authenticated
        else {

          // Broadcast Event
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

          return null;
        }

        function getCurrentUserSuccess (data) {

          // Deserialize the return:
          var user = data.data;

          // (Creating a Session also requires the token):
          var key = $localStorage._mendelToken;

          // Create Session
          Session.create(key, user);

          // Broadcast Event
          $rootScope.$broadcast(AUTH_EVENTS.getCurrentUserSuccess);

          return user;
        }

        function getCurrentUserError (error) {

          // Destroy Session
          Session.destroy();
          // (Clears any invalid tokens from localStorage)

          // Broadcast Event
          $rootScope.$broadcast(AUTH_EVENTS.getCurrentUserFailed);
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

          // Show Error Toast
          for (var i in error.data) {
            toastr.error(error.data[i][0], 'Login Error');
          }

          return null;
        }
      }

      function changePassword (data) {

        return $http({
          method: 'POST',
          url: apiHost + '/password/change/',
          data: $httpParamSerializerJQLike(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        });

      }
    }
  })();