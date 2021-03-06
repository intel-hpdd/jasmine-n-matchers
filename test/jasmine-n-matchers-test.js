'use strict';

var execFile = require('child_process').execFile;

describe('jasmine n matchers', function () {

  var spy;

  beforeEach(function () {
    spy = jasmine.createSpy('spy');
  });

  describe('toHaveBeenCalledOnce', function () {
    beforeEach(function () {
      spy();
    });

    it('should check that a spy has been called once', function () {
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not match if called more than once', function () {
      spy();

      expect(spy).not.toHaveBeenCalledOnce();
    });
  });

  describe('toHaveBeenCalledTwice', function () {
    beforeEach(function () {
      rInvoke(2, spy, []);
    });

    it('should check that a spy has been called twice', function () {
      expect(spy).toHaveBeenCalledTwice();
    });

    it('should not match if called more than twice', function () {
      spy();

      expect(spy).not.toHaveBeenCalledTwice();
    });

  });

  describe('toHaveBeenCalledThrice', function () {
    beforeEach(function () {
      rInvoke(3, spy, []);
    });

    it('should check that a spy has been called 3 times', function () {
      expect(spy).toHaveBeenCalledThrice();
    });

    it('should not match if called more than twice', function () {
      spy();

      expect(spy).not.toHaveBeenCalledThrice();
    });

  });

  describe('toHaveBeenCalledNTimes', function () {

    it('should report 0 calls when it has not been called', function () {
      expect(spy).toHaveBeenCalledNTimes(0);
    });

    it('should report 1 call when called once', function () {
      spy();

      expect(spy).toHaveBeenCalledNTimes(1);
    });

    it('should report as many calls as the spy has received', function () {
      rInvoke(77, spy, []);

      expect(spy).toHaveBeenCalledNTimes(77);
    });

  });

  describe('toHaveBeenCalledOnceWith', function () {
    beforeEach(function () {
      spy('foo', 'bar');
    });

    it('should fail if called more than once', function () {
      spy('foo', 'bar');

      expect(spy).not.toHaveBeenCalledOnceWith('foo', 'bar');
    });

    it('should check for 1 call and check the arguments of the invocation', function () {
      expect(spy).toHaveBeenCalledOnceWith('foo', 'bar');
    });

    it('should check for 1 call and know if the arguments of the invocation are different', function () {
      expect(spy).not.toHaveBeenCalledOnceWith('foo', 'baz');
    });

    describe('when an expectation fails', function () {
      it('should report the failure', function (done) {
        var testPath = 'test/fixtures/proper-failure-msg-test.js';

        execFile('jasmine', [testPath], {}, function assert (err, stdout) {
          if (!err) done.fail(err); // If the test passes, `err` will be truthy...but, it should fail.

          expect(stdout).toContain('[ \'\' ] 1 time(s) but it was found 0 time(s).');

          done();
        });
      });
    });
  });

  describe('custom error equality tester', function () {
    it('should succeed for errors with matching messages.', function () {
      var e = new Error('whoops');
      expect(e).toEqual(new Error('whoops'));
    });

    it('should fail errors that do not have the same message', function () {
      expect(new Error('whoops')).not.toEqual(new Error('diff'));
    });

    it('should pass when the errors are the same subtype', function () {
      var errSpy = jasmine.createSpy('err-spy');
      errSpy(new EvalError('eval err'));
      expect(errSpy).toHaveBeenCalledOnceWith(new EvalError('eval err'));
    });
  });

  describe('toHaveBeenCalledTwiceWith', function () {
    beforeEach(function () {
      rInvoke(2, spy, ['foo', 'bar']);
    });

    it('should fail if called more than twice', function () {
      spy('foo', 'bar');

      expect(spy).not.toHaveBeenCalledTwiceWith('foo', 'bar');
    });

    it('should check for 2 calls and check the arguments of the invocation', function () {
      expect(spy).toHaveBeenCalledTwiceWith('foo', 'bar');
    });

    it('should check for 2 calls and know if the arguments of the invocations are different', function () {
      expect(spy).not.toHaveBeenCalledTwiceWith('foo', 'baz');
    });
  });

  describe('toHaveBeenCalledThriceWith', function () {
    beforeEach(function () {
      rInvoke(3, spy, ['foo', 'bar']);
    });

    it('should fail if called more than 3 times', function () {
      spy('foo', 'bar');

      expect(spy).not.toHaveBeenCalledThriceWith('foo', 'bar');
    });

    it('should check for 3 calls and check the arguments of the invocation', function () {
      expect(spy).toHaveBeenCalledThriceWith('foo', 'bar');
    });

    it('should check for 3 calls and know if the arguments of the invocations are different', function () {
      expect(spy).not.toHaveBeenCalledThriceWith('foo', 'baz');
    });
  });

  describe('toHaveBeenCalledNTimesWith', function () {

    it('should report 0 calls when it has not been called', function () {
      expect(spy).toHaveBeenCalledNTimesWith(0, 'foo', 'bar');
    });

    it('should report as many calls as the spy has received', function () {
      rInvoke(22, spy, ['foo', 'bar']);

      expect(spy).toHaveBeenCalledNTimesWith(22, 'foo', 'bar');
    });

  });

  describe('when matched against a spy that was called with an error', function () {
    var errSpy, errObj;

    beforeEach(function () {
      errSpy = jasmine.createSpy('errSpy');
      errObj = new Error('whoops');
    });

    describe('toHaveBeenCalledOnceWith', function () {
      describe('n items', function () {

        it('should check for 1 call with 2 errors', function () {
          errSpy(errObj, errObj);
          expect(errSpy).toHaveBeenCalledOnceWith(errObj, errObj);
        });

        it('should fail for 1 call with 2 errors when only one error was passed', function () {
          errSpy(errObj);
          expect(errSpy).not.toHaveBeenCalledOnceWith(errObj, errObj);
        });

      });
      describe('1 item', function () {
        beforeEach(function () {
          errSpy(errObj);
        });

        it('should check for 1 call with an error', function () {
          expect(errSpy).toHaveBeenCalledOnceWith(errObj);
        });

        it('should check for 1 call with an error and know if the message of the error is different', function () {
          expect(errSpy).not.toHaveBeenCalledOnceWith(new Error('a different error'));
        });

        it('should check for 1 call with an error and fail if called more than 1 time', function () {
          errSpy(errObj);

          expect(errSpy).not.toHaveBeenCalledThriceWith(new Error('a different error'));
        });

        describe('and the actual and expected errors are of different types but identical messages', function () {

          it('should fail against an EvalError expectation', function () {
            expect(errSpy).not.toHaveBeenCalledOnceWith(new EvalError('whoops'));
          });

          it('should fail against a RangeError expectation', function () {
            expect(errSpy).not.toHaveBeenCalledOnceWith(new RangeError('whoops'));
          });

          it('should fail against a ReferenceError expectation', function () {
            expect(errSpy).not.toHaveBeenCalledOnceWith(new ReferenceError('whoops'));
          });

          it('should fail against a SyntaxError expectation', function () {
            expect(errSpy).not.toHaveBeenCalledOnceWith(new SyntaxError('whoops'));
          });

          it('should fail against a TypeError expectation', function () {
            expect(errSpy).not.toHaveBeenCalledOnceWith(new TypeError('whoops'));
          });

          it('should fail against a URIError expectation', function () {
            expect(errSpy).not.toHaveBeenCalledOnceWith(new URIError('whoops'));
          });

        });
      });
    });

    describe('toHaveBeenCalledTwiceWith', function () {
      beforeEach(function () {
        rInvoke(2, errSpy, [errObj]);
      });

      it('should check for 2 calls with an error', function () {
        expect(errSpy).toHaveBeenCalledTwiceWith(errObj);
      });

      it('should check for 2 calls with an error and know if the message of the error is different', function () {
        expect(errSpy).not.toHaveBeenCalledTwiceWith(new Error('a different error'));
      });
      it('should check for 2 calls with an error and fail if called more than 2 times', function () {
        errSpy(errObj);

        expect(errSpy).not.toHaveBeenCalledThriceWith(new Error('a different error'));
      });
    });

    describe('toHaveBeenCalledThriceWith', function () {
      beforeEach(function () {
        rInvoke(3, errSpy, [errObj]);
      });

      it('should check for 3 calls with an error', function () {
        expect(errSpy).toHaveBeenCalledThriceWith(errObj);
      });

      it('should check for 3 calls with an error and know if the message of the error is different', function () {
        expect(errSpy).not.toHaveBeenCalledThriceWith(new Error('a different error'));
      });

      it('should check for 3 calls with an error and fail if called more than 3 times', function () {
        errSpy(errObj);

        expect(errSpy).not.toHaveBeenCalledThriceWith(new Error('a different error'));
      });
    });

    describe('toHaveBeenCalledNTimesWith', function () {

      beforeEach(function () {
        rInvoke(5, errSpy, [errObj]);
      });

      it('should check for n calls with an error', function () {
        expect(errSpy).toHaveBeenCalledNTimesWith(5, errObj);
      });

      it('should check for n calls with an error and fail if called more than expected', function () {
        errSpy(errObj);

        expect(errSpy).not.toHaveBeenCalledNTimesWith(5, errObj);
      });
    });
  });
});

function rInvoke (n, f, xs) {
  if (n === 0) // exit case
    return;

  f.apply(null, xs);

  rInvoke(--n,  f,  xs);  // recursive case
}
