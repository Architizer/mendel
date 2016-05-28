(function() {
  'use strict';

  angular
    .module('static')
    .run(runBlock);

  /** @ngInject */
  function runBlock(AuthService) {

    // Get Current User
    AuthService.getCurrentUser();
  }

})();
