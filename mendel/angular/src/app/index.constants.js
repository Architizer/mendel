/* global moment:false */
(function() {
  'use strict';

  // Base configuration object (default to DEBUG = true for development)
  var mendelConfig = { 'DEBUG': true };

  // Get Configuration from window (passed in from Django)
  if (window) {
    Object.assign(mendelConfig, window.djangoEnv);
  }

  // Set API host conditionally from window.djangoEnv.DEBUG
  var apiHost = (mendelConfig.DEBUG ? '//localhost:5000/api/v1' : '/api/v1');

  // Set CSRF token from window.djangoEnv.csrf_token
  var csrfToken = mendelConfig.csrf_token || '';

  angular
    .module('static')
    .constant('moment', moment)
    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    })
    .constant('apiHost', apiHost)
    .value('csrfToken', csrfToken);

})();
