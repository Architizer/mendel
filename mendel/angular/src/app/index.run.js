(function() {
  'use strict';

  angular
    .module('mendel')
    .run(runBlock);

  /** @ngInject */
  function runBlock(AuthService) {

    // Get Current User
    AuthService.getCurrentUser();
  }

})();
