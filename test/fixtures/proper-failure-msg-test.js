'use strict';

describe('a test that should fail', function () {
  it('should return the proper expected message', function () {
    var noArgSpy = jasmine.createSpy('noArgSpy');
    noArgSpy();

    expect(noArgSpy).toHaveBeenCalledOnceWith('');

  });
});
