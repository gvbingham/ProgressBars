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
    test('returns a negative Number if in the past', function () {
        assert.isNumber(get_how_many_seconds_to_date('1979-01-01'));
        assert(get_how_many_seconds_to_date('1979-01-01') < 0);
    });
    test('returns a positive Number if in the future', function () {
        assert.isNumber(get_how_many_seconds_to_date('4000-01-01'));
        assert(get_how_many_seconds_to_date('4000-01-01') > 0);
    });
});
suite('get_how_many_seconds_to_time', function () {
    test('is a function', function () {
        assert.isFunction(get_how_many_seconds_to_time);
    });
    test('returns a Number', function () {
        assert.isNumber(get_how_many_seconds_to_time('12:00'));
    });
    test('returns correct number for maximum value \'23:59\'', function () {
        assert(get_how_many_seconds_to_time('23:59') == 86340);
    });
    test('returns correct number for minimum value \'00:00\'', function () {
        assert(get_how_many_seconds_to_time('00:00') == 0);
    });
});
suite('BAR Object', function () {
    test('is an Object', function () {
        assert.isObject(BAR);
    });
    test('BAR contains settings', function () {
        assert.property(BAR, 'settings')        
        assert.isObject(BAR.settings);
    });
    test('BAR contains bars array', function () {
        assert.property(BAR, 'bars')        
        assert.isArray(BAR.bars)
    });
    test('BAR.settings contains current_category', function () {
        assert.property(BAR.settings, 'current_category')        
        assert.isString(BAR.settings.current_category)
    });
});
suite('data Object', function () {
    test('data Object contains necessary information', function () {
        var temp = {
            char_set : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            fib : [1,2,3,5,8,13,21,34,55],
            time : {
                Years   : 31536000, 
                Months  : 2628000, 
                Weeks   : 604800, 
                Days    : 86400, 
                Hours   : 3600, 
                Minutes : 60, 
                Seconds : 1, 
            }, 
            relative_time : [ 
                {scope : 'Seconds', value : 1,        cap : 55},
                {scope : 'Minutes', value : 60,       cap : 55},
                {scope : 'Hours',   value : 3600,     cap : 21},
                {scope : 'Days',    value : 86400,    cap : 5},
                {scope : 'Weeks',   value : 604800,   cap : 3},
                {scope : 'Months',  value : 2628000,  cap : 8},
                {scope : 'Years',   value : 31536000, cap : 55},
            ],
            fib_values : [1, 2, 3, 5, 8, 13, 21, 34, 55, 60, 120,
                180, 300, 480, 780, 1260, 2040, 3300, 3600, 7200,
                10800, 18000, 28800, 46800, 75600, 86400, 172800,
                259200, 432000, 604800, 1209600, 1814400, 2628000,
                5256000, 7884000, 13140000, 21024000, 31536000,
                63072000, 94608000, 157680000, 252288000, 409968000,
                662256000, 1072224000, 1734480000
            ],
        };
        assert.deepEqual(data, temp);
    });
    test('data matches correct data types', function () {
        assert.isString(data.char_set);
        assert.isArray(data.fib);
        assert.isObject(data.time);
        assert.isArray(data.relative_time);
        assert.isArray(data.fib_values);
    });
});
suite('Create a new bar', function () {
    test('create with no arguments', function () {
        var x = new create_bar(); 
        assert.isObject(x);
        assert.match(x.id, /\w{6}/, 'matches any letter or number 6 places');
        assert.match(x.title, /New bar/, 'title matches \'New bar\'');
        assert(x.description == null, 'default description is null');
        assert(x.category == "main", 'default category of main is used');
        assert.match(x.created, /\d{13}/, 'created matches time stamp');
        assert.match(x.stamp, /\d{13}/, 'created matches time stamp');
        assert(x.history.length == 0, 'history is an empty array');
        assert(x.type == 'count_down', 'type is count_down');
        assert(x.scope == null, 'default scope of null is used');
        assert(x.value == null, 'default value of null is used');
        assert(x.date == null, 'default date of null is used');
        assert(x.time == null, 'default time of null is used');
    });
    test('create with all arguments', function () {
        var x = new create_bar({
            title : 'foo',
            description : 'bar',
            category : 'foobar',
            created : 1429715565899,
            history : [1, 2, 3, 4, 5],
            type : 'count_up',
            scope : 'Seconds',
            value : 300,
        }); 
        assert.isObject(x);
        assert.match(x.id, /\w{6}/, 'matches any letter or number 6 places');
        assert.match(x.title, /foo/, 'title matches \'foo\'');
        assert(x.description == 'bar', 'default description is boo');
        assert(x.category == "foobar", 'default category of main is used');
        assert.match(x.created, /\d{13}/, 'created matches time stamp');
        assert.match(x.stamp, /\d{13}/, 'created matches time stamp');
        assert.isArray(x.history, 'history is an array');
        assert(x.type == 'count_up', 'type is count_up');
        assert(x.scope == 'Seconds', 'scope is Seconds');
        assert(x.value == 300, 'value of 300');
    });
});