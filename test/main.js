var assert = chai.assert

suite('get_time', function () {
    test('get_time is a function', function () {
        assert.isFunction(get_time, 'get_time is a function');
    });
    test('should be a number', function () {
        assert.isNumber(get_time(), 'get_time returns a number');
    });
    test('matches expected digits', function () {
        assert.match(get_time(), /^\d{13}$/,  'matches the correct digits');
    });
});
