(function() {
  'use strict';

  angular
    .module('static')
    .factory('AuthService', AuthService);

    /** @ngInject */
    function AuthService ($rootScope, $http, $httpParamSerializerJQLike, $state, $localStorage, AUTH_EVENTS, apiHost, Session, toastr) {

      return {
        login: login,
        logout: logout,
        getCurrentUser: getCurrentUser,
        isAuthenticated: isAuthenticated,
      };

      function isAuthenticated () {

        return !!Session.user;
      }

      function login (credentials) {

        return $http({
          method: 'POST',
          url: apiHost + '/login/',
          data: $httpParamSerializerJQLike(credentials),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(loginSuccess)
        .catch(loginError);


        function loginSuccess (data) {

          // Deserialize the return:
          var key = data.data.key;
          var user = data.data.user;

          // Create Session
          Session.create(key, user);

          // Emit event
          $rootScope.$emit(AUTH_EVENTS.loginSuccess);

          // Show Success Toast and Redirect
          toastr.success('Logged In');
          $state.go('main');

          return user;
        }

        function loginError (error) {

          // Emit event
          $rootScope.$emit(AUTH_EVENTS.loginFailure);

          // Show Error Toast
          toastr.error(JSON.stringify(error));
        }
      }

      function logout () {

        // Construct payload for sending token back with logout
        var payload = {
          token: Session.token
        };

        return $http({
          method: 'POST',
          url: apiHost + '/logout/',
          data: $httpParamSerializerJQLike(payload),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(logoutSuccess)
        .catch(logoutError);

        function logoutSuccess (data) {

          // Destroy Session
          Session.destroy();

          // Emit Event
          $rootScope.$emit(AUTH_EVENTS.logoutSuccess);

          // Show Toast and Redirect
          toastr.info('Logged Out');
          $state.go('login');
        }

        function logoutError (error) {

          // Show Error Toast
          toastr.error(JSON.stringify(error));
        }
      }

      function getCurrentUser () {

        // First, check if there's an existing Session
        if (!!Session.user) {

          // Emit Event
          $rootScope.$emit(AUTH_EVENTS.getCurrentUserSuccess);

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
          })
          .then(getCurrentUserSuccess)
          .catch(getCurrentUserError);
        }

        // Otherwise, we're not authenticated
        else {

          // Emit Event
          $rootScope.$emit(AUTH_EVENTS.notAuthenticated);

          return null;
        }

        function getCurrentUserSuccess (data) {

          // Deserialize the return:
          var user = data.data;

          // (Creating a Session also requires the token):
          var key = $localStorage._mendelToken;

          // Create Session
          Session.create(key, user);

          // Emit Event
          $rootScope.$emit(AUTH_EVENTS.getCurrentUserSuccess);

          return user;
        }

        function getCurrentUserError (error) {

          // Destroy Session
          Session.destroy();
          // (Clears any invalid tokens from localStorage)

          // Emit Event
          $rootScope.$emit(AUTH_EVENTS.getCurrentUserFailed);

          // Show Error Toast
          toastr.error(JSON.stringify(error));

          return null;
        }
      }
    }
  })();