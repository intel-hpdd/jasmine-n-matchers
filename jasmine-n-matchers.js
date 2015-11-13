beforeEach(function () {
  'use strict';

  var pp = jasmine.pp.bind(jasmine);

  jasmine.addCustomEqualityTester(errorEquality);

  function errorEquality (a, b) {
    if (a instanceof Error && b instanceof Error)
      return (a.message === b.message && getConstructor(a) === getConstructor(b));

    // Otherwise, return undefined:
    // http://jasmine.github.io/2.3/custom_equality.html
  }

  function getConstructor (x) {
    return Object.getPrototypeOf(x).constructor;
  }

  jasmine.addMatchers({
    toHaveBeenCalledOnce: toHaveBeenCalledN(1),
    toHaveBeenCalledTwice: toHaveBeenCalledN(2),
    toHaveBeenCalledThrice: toHaveBeenCalledN(3),
    toHaveBeenCalledNTimes: toHaveBeenCalledN(null),
    toHaveBeenCalledOnceWith: toHaveBeenCalledNTimesWith(1),
    toHaveBeenCalledTwiceWith: toHaveBeenCalledNTimesWith(2),
    toHaveBeenCalledThriceWith: toHaveBeenCalledNTimesWith(3),
    toHaveBeenCalledNTimesWith: toHaveBeenCalledNTimesWith(null)
  });

  /**
   * HOF that checks a spy was called n times
   * @param {Number} n
   * @returns {Function}
   */
  function toHaveBeenCalledN (n) {
    return function matcherFactory (util, customEqualityTesters) {
      return {
        compare: function compare (actual, expected) {
          if (n == null)
            n = expected;

          if (!jasmine.isSpy(actual))
            return {
              result: false,
              message: 'Expected a spy, but got ' + pp(actual) + '.'
            };

          var count = actual.calls.count();

          var result = {
            pass: util.equals(count, n, customEqualityTesters)
          };

          var msg = 'Expected spy ' + actual.and.identity() + ' to have been called ' + n + ' time(s), but was ';
          msg = (count === 0 ? msg + 'never called.' : msg + 'called ' + count + ' times.');

          result.message = (result.pass ? msg.replace('to have', 'not to have') : msg);

          return result;
        }
      };
    };
  }

  /**
   * HOF that checks a spy was called n times with args.
   * @param {Number} n
   * @returns {Function}
   */
  function toHaveBeenCalledNTimesWith (n) {
    return function matcherFactory (util, customEqualityTesters) {
      return {
        compare: function compare () {
          var expectedArgs = jasmine.util.argsToArray(arguments);
          var actual = expectedArgs.shift();

          if (n == null)
            n = expectedArgs.shift();

          if (!jasmine.isSpy(actual))
            return {
              result: false,
              message: 'Expected a spy, but got ' + pp(actual) + '.'
            };

          var allActualArgs = actual.calls.allArgs();

          var foundCount = allActualArgs.reduce(function reduceCount (count, args) {
            if (util.equals(args, expectedArgs, customEqualityTesters))
              count += 1;

            return count;
          }, 0);

          var result = {
            pass: util.equals(foundCount, n)
          };

          var id = actual.and.identity();

          if (result.pass)
            result.message = fmt('Expected spy %s not to have been called with %s %s time(s) but it was.',
              [id, pp(expectedArgs), n]);
          else
            result.message = fmt('%s %s time(s) but it was found %s time(s).\n\nSpy %s call listing:\n%s.',
              [pp(expectedArgs), n, foundCount, id, pp(allActualArgs)]);

          return result;
        }
      };
    };
  }
  function fmt (x, xs) {
    return xs.reduce(function format (msg, replacement) {
      return msg.replace(/\%s/, replacement);
    }, x);
  }

});
