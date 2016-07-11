(function() {
  'use strict';

  describe('category filter bar', function() {

    beforeEach(module('mendel'));

    describe('directive', function () {

      var compile, scope, directiveElement;

      beforeEach(function () {
        inject(function($compile, $rootScope) {
          compile = $compile;
          scope = $rootScope.$new();
        });

        directiveElement = getCompiledElement();
      });

      function getCompiledElement() {
        var element = angular.element('am-category-filter-bar');
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
      }

      it('has an input element', function () {
        var inputElement = directiveElement.find('input');

        expect(inputElement).toBeDefined();
      });

      it('has access to a list of categories', function () {


        expect(directiveElement.controller.categories).toBeDefined();
      });

      it('sets the overlay mask when the input has value', function () {

      });

      it('returns categories that match a given input', function () {

      });

      it('allows a user to use the arrow keys to focus categories', function () {

      });

      describe('handle() function', function () {

        it('sets a category to "selected" when it is focused and the enter key or spacebar is pressed', function () {

        });

        it('sets a category to "selected" when it is clicked', function () {

        });

        it('refocuses the input field when a category is clicked or otherwise selected', function () {

        });

        it('resets the filter bar when a category is clicked or otherwise selected', function () {

        });

      });

    });

  });
})();
