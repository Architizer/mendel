(function() {
  'use strict';

  angular
    .module('mendel')
    .config(config);

  /** @ngInject */
  function config($logProvider, $locationProvider, $resourceProvider, $httpProvider, toastrConfig) {

    // Configure CSRF
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.interceptors.push('apiInterceptor');

    // Enable log
    $logProvider.debugEnabled(true);

    // Enable HTML5 History Mode
    $locationProvider.html5Mode(true);

    // Don't strip trailing slashes from $resource API calls
    $resourceProvider.defaults.stripTrailingSlashes = false;

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 2000;
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;
  }

})();
