(function() {
  'use strict';

  angular
    .module('mendel')
    .service('Session', Session);

    /** @ngInject */
    function Session ($localStorage) {

      // Create Session
      this.create = function createSession (key, user) {

        this.user = user;
        this.token = key;

        // Update Local Storage with Token
        $localStorage._mendelToken = this.token;

        return this;
      };

      // Destroy Session
      this.destroy = function destroySession () {

        this.user = null;
        this.token = null;

        // Update Local Storage with Token
        $localStorage._mendelToken = this.token;

        return this;
      };
    }
  })();