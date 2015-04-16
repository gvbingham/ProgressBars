suite('get_time', function () {
    test('is a function', function () {
        assert.isFunction(get_time, 'get_time is a function');
    });
    test('should be a number', function () {
        assert.isNumber(get_time(), 'get_time returns a number');
    });
    test('matches expected digits', function () {
        assert.match(get_time(), /^\d{13}$/,  'matches the correct digits');
    });
});
suite('get_relative_time_difference', function () {
    test('is a function', function () {
        assert.isFunction(get_relative_time_difference, 'get_relative_time_difference is a function'); 
    });
    test('returns an object', function () {
        assert.isObject(get_relative_time_difference(500), 'get_relative_time_difference returns an object');
    });
    test('limit test on 0', function () {
        var obj = { //tobe in data.js file 
            Days: 0,
            Hours: 0, 
            Minutes: 0, 
            Months: 0, 
            Seconds: 0, 
            Weeks: 0, 
            Years: 0 
        };
        assert.deepEqual(get_relative_time_difference(0), obj, 'matches obj with all 0 values'); 
    });
    test('limit test on -10', function () {
        var obj = { //tobe in data.js file 
            Days: 0,
            Hours: 0, 
            Minutes: 0, 
            Months: 0, 
            Seconds: 0, 
            Weeks: 0, 
            Years: 0 
        };
        assert.deepEqual(get_relative_time_difference(-10), obj, 'matches obj with all 0 values if given a negative number'); 
    });
    test('check correct count on 34858861', function () {
        var obj = { //tobe in data.js file 
            Days: 1,
            Hours: 1, 
            Minutes: 1, 
            Months: 1, 
            Seconds: 1, 
            Weeks: 1, 
            Years: 1 
        };
        assert.deepEqual(get_relative_time_difference(34858861), obj, 'matches obj with all 1 values'); 
    });
});
suite('get_relative_time_text', function () {
    test('is a function', function () {
        assert.isFunction(get_relative_time_text);
    });
    test('returns a string', function () {
        assert.isString(get_relative_time_text(100));
    });
    test('check with all values with text given 34858861', function () {
        assert(get_relative_time_text(34858861) == "1 Years 1 Months 1 Weeks 1 Days 1 Hours 1 Minutes 1 Seconds ")
    });
});
suite('get_how_many_seconds_to_date', function () {
    test('is a function', function () {
        assert.isFunction(get_how_many_seconds_to_date);
    });
    test('returns a Number', function () {
        assert.isNumber(get_how_many_seconds_to_date('2015-04-17'));
    });
    test('throws an error if data is undefined', function () {
        assert.Throw(get_how_many_seconds_to_date(), /you did not specify a date/);
    });
});