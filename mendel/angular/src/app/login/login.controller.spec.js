(function() {
  'use strict';

  describe('login', function(){

    beforeEach(module('mendel'));

    describe('controller', function () {

      var ctrl, Session;

      beforeEach(inject(function($controller, _Session_) {
        ctrl = $controller('LoginController');
        Session = _Session_;
        
        spyOn(ctrl, 'submit');
      }));

      it('has a credentials object with username and password', function () {

        expect(ctrl.credentials.username).toBeDefined();
        expect(ctrl.credentials.password).toBeDefined();
      });

      describe('submitLogin() function', function () {

        it('exists', function () {

          expect(ctrl.submit).toBeDefined();
        });

        it('logs a user in', function () {

          ctrl.credentials.username = 'frank';
          ctrl.credentials.password = 'lloydwright';

          ctrl.submit(ctrl.credentials);

          expect(ctrl.submit).toHaveBeenCalledWith(ctrl.credentials);
        });
      });
    });

  });
})();
