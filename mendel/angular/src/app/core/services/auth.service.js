(function() {
  'use strict';

  angular
    .module('static')
    .factory('AuthService', function ($rootScope, $http, $httpParamSerializerJQLike, $state, $localStorage, AUTH_EVENTS, apiHost, Session, toastr) {
      var authService = {};
     
      authService.login = function login(credentials) {

        return $http({
          method: 'POST',
          url: apiHost + '/login/',
          data: $httpParamSerializerJQLike(credentials),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function loginSuccess (data) {

          // Deserialize the return:
          var key = data.data.key;
          var user = data.data.user;

          // Create Session
          Session.create(key, user);

          // Show Success Toast and Redirect
          toastr.success('Logged In');
          $state.go('main');

        }, function loginError (error) {

          toastr.error(JSON.stringify(error));
        });
      };

      authService.logout = function logout() {

        // Construct payload for sending token back with logout
        var payload = {
          token: Session.token
        };

        return $http({
          method: 'POST',
          url: apiHost + '/logout/',
          data: $httpParamSerializerJQLike(payload),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function logoutSuccess (data) {

          // Destroy Session
          Session.destroy();

          // Show Toast and Redirect
          toastr.info('Logged Out');
          $state.go('login');

        }, function logoutError (error) {

          toastr.error(JSON.stringify(error));
        });
      };

      authService.getCurrentUser = function getCurrentUser() {

        // First, check if there's an existing Session
        if (!!Session.user) {

          // Yes? Return this user
          return Session.user;
        }

        // If no, check if there's a token to retrieve the user
        else if (!!$localStorage._mendelToken) {

          // Set Authorization Header with Token
          $http.defaults.headers.common['Authorization'] = 'Token ' + $localStorage._mendelToken;

          // Get User info from endpoint
          $http({
            method: 'GET',
            url: apiHost + '/user/'
          }).then(function getCurrentUserSuccess (data) {

            // Deserialize the return:
            var user = data.data;

            // (Creating a Session also requires the token):
            var key = $localStorage._mendelToken;

            // Create Session
            Session.create(key, user);

          }, function getCurrentUserError (error) {

            toastr.error(JSON.stringify(error));
          });
        }

        else {

          return null;
        }
      };

      authService.isAuthenticated = function isAuthenticated() {

        return !!Session.user;
      };

      return authService;
    });
  })();