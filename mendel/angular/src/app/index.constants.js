/* global moment:false */
(function() {
  'use strict';

  angular
    .module('static')
    .constant('moment', moment)
    .constant('apiHost', '//localhost:5000');

})();
