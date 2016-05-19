(function() {
  'use strict';

  angular
    .module('static')
    .config(config);

  /** @ngInject */
  function config($logProvider, $locationProvider, $resourceProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Enable HTML5 History Mode
    $locationProvider.html5Mode(true);

    // Don't strip trailing slashes from $resource API calls
    $resourceProvider.defaults.stripTrailingSlashes = false;

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

})();
