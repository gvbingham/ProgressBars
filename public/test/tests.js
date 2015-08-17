suite('time.js', function () {
    suiteSetup(function () {
        BAR.bars.push( create_bar_common({type : 'interval', scope : 'Years', value : 1}) );
        get_remaining_seconds(0);
    });
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
    suite('get_relative_time_text', function () {
        test('is a function', function () {
            assert.isFunction(get_relative_time_text);
        });
        test('BAR.bars[0][\'time_text\'] is set and is a string', function () {
            assert.isString(BAR.bars[0]['time_text']);
            assert.equal(BAR.bars[0]['time_text'], '11 Months 4 Weeks');
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
    suiteTeardown('', function () {
        BAR.bars = [];    
    });
});


suite('main.js', function () {
    suiteSetup(function () {
        BAR.bars.push( new create_bar_common({category : 'foo', type : 'count_up'}) );
        BAR.bars.push( new create_bar_common({category : 'bar', type : 'count_down'}) );
        BAR.bars.push( new create_bar_common({category : 'bar', type : 'reverse_count_down'}) );
        BAR.bars.push( new create_bar_common({category : 'bar', type : 'what!'}) );
        BAR.bars.push( new create_bar_common({category : 'bar', type : 'count_down', scope : 'Seconds', value : 1, created : 1429912093556}) );
        BAR.bars.push( new create_bar_common({category : 'bar', type : 'reverse_count_down', scope : 'Seconds', value : 1, created : 1429912093556}) );
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
                fib_values : [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 60, 120,
                    180, 300, 480, 780, 1260, 2040, 3300, 3600, 7200,
                    10800, 18000, 28800, 46800, 75600, 86400, 172800,
                    259200, 432000, 604800, 1209600, 1814400, 2628000,
                    5256000, 7884000, 13140000, 21024000, 31536000,
                    63072000, 94608000, 157680000, 252288000, 409968000,
                    662256000, 1072224000, 1734480000
                ],
                goog : {},
                need_sync : true,
            };
            assert.deepEqual(data, temp);
        });
        test('data matches correct data types', function () {
            assert.isString(data.char_set);
            assert.isArray(data.fib);
            assert.isObject(data.time);
            assert.isObject(data.goog);
            assert.isArray(data.relative_time);
            assert.isArray(data.fib_values);
            assert.isBoolean(data.need_sync);
        });
    });
    suite('Create a new bar', function () {
        test('create with no arguments', function () {
            var x = create_bar_common(); 
            assert.isObject(x);
            assert.match(x.id, /\w{6}/, 'matches any letter or number 6 places');
            assert.match(x.title, /New bar/, 'title matches \'New bar\'');
            assert(x.description == null, 'default description is null');
            assert(x.category == "main", 'default category of main is used');
            assert.match(x.created, /^\d{13}$/, 'created matches time stamp');
            assert.match(x.stamp, /^\d{13}$/, 'created matches time stamp');
            assert(x.history.length == 0, 'history is an empty array');
            assert(x.type == 'interval', 'type is interval');
            assert(x.scope == null, 'default scope of null is used');
            assert(x.value == null, 'default value of null is used');
            assert(x.date == null, 'default date of null is used');
            assert(x.time == null, 'default time of null is used');
        });
        test('create with most arguments', function () {
            var x = create_bar_common({
                title : 'foo',
                description : 'bar',
                category : 'foobar',
                created : 1429715565899,
                history : [1, 2, 3, 4, 5],
                type : 'count_up',
            }); 
            assert.isObject(x);
            assert.match(x.id, /\w{6}/, 'matches any letter or number 6 places');
            assert.match(x.title, /foo/, 'title matches \'foo\'');
            assert(x.description == 'bar', 'default description is boo');
            assert(x.category == "foobar", 'default category of main is used');
            assert.match(x.created, /^\d{13}$/, 'created matches time stamp');
            assert.match(x.stamp, /^\d{13}$/, 'created matches time stamp');
            assert.isArray(x.history, 'history is an array');
            assert(x.type == 'count_up', 'type is count_up');
            assert(x.color == 'lightBlue');
        });
        test('create with date and time arguments', function () {
            var x = create_bar_common({
                title : 'foo',
                description : 'bar',
                category : 'foobar',
                created : 1429715565899,
                history : [1, 2, 3, 4, 5],
                type : 'target',
                date : '2015-10-10',
                time : '20:00',
            }); 
            assert.isObject(x);
            assert.match(x.id, /\w{6}/, 'matches any letter or number 6 places');
            assert.match(x.title, /foo/, 'title matches \'foo\'');
            assert(x.description == 'bar', 'default description is boo');
            assert(x.category == "foobar", 'default category of main is used');
            assert.match(x.created, /^\d{13}$/, 'created matches time stamp');
            assert.match(x.stamp, /^\d{13}$/, 'created matches time stamp');
            assert.isArray(x.history, 'history is an array');
            assert(x.type == 'target', 'type is target');
            assert(x.scope == 'Seconds', 'scope is Seconds');
            assert(x.value > 0, 'value is greater than 0');
            assert.isNumber(x.value, 'value is a number');
            assert(x.color == 'blue');
            assert(x.scope_value > 0);
            assert.isNumber(x.scope_value);
        });
    });
    suite('get_scope', function () {
        test('correct return with normal arguments', function () {
            assert.isNumber(get_scope('Seconds', 60));
            assert(get_scope('Seconds', 60) == 60);
            assert(get_scope('Weeks', 60) == 36288000);
        });
    });
    suite('get_categories_list', function () {
        test('get_categories_list will return correct categories.', function () {
            assert.isArray(get_categories_list());
            assert(get_categories_list()[0] == 'foo');
            assert(get_categories_list()[1] == 'bar');
            assert(get_categories_list()[2] == 'bar');
        });
    });
    suite('create_id', function () {
        test('create_id gets an id', function () {
            assert.match(create_id(), /^\w{6}$/, 'matches 6 letters or numbers');
            assert.isString(create_id());
        });
    });
    suite('get_index_by_id', function () {
        test('get_index_by_id',  function () {
            assert.isNumber(get_index_by_id(BAR.bars[0].id));
            assert(get_index_by_id(BAR.bars[1].id) == 1);
        });
    });
    suite('update_bar', function () {
        test('update_bar can change most items of the bar', function () {
            assert.propertyVal(update_bar(1, {"id" : "poops"}), "id", "poops");
            assert.propertyVal(update_bar(1, {"title" : "sy"}), "title", "sy");
            assert.propertyVal(update_bar(1, {"description" : "Doodle"}), "description", "Doodle");
            assert.propertyVal(update_bar(1, {"category" : "barz"}), "category", "barz");
            assert.propertyVal(update_bar(1, {"type" : "count_down"}), "type", "count_down");
            assert.propertyVal(update_bar(1, {"color" : "Black"}), "color", "Black");
            //TODO need further tests for security and for correct adjustments for each property
        });
    });
    suite('reset_bar', function () {//BROKEN
        test('reset_bar handles count_up type', function () {
            assert.isNumber(reset_bar(0).stamp);
            assert.match(reset_bar(0).stamp, /^\d{13}$/);
        });
    });
    suite('get_percent', function () {
        test('using count_up', function () {
            assert.closeTo(get_percent(0), 50, 50);
        });
        test('using count_down', function () {
            assert.closeTo(get_percent(1), 50, 50);
        });
        test('using reverse_count_down', function () {
            assert.closeTo(get_percent(2), 50, 50);
        });
        test('using type that is unmatched', function () {
            assert(get_percent(3) == 0);
        });
        test('get_percent when percent is higher than 100', function () {
            assert(get_percent(4) == 0);
        });
        test('get_percent when percent is lower than 0', function () {
            assert(get_percent(5) == 100);
        });
    });
    suite('delete_bar', function () {
        test('delete_bar will delete a bar',  function () {
            assert(BAR.bars.length - 1 == delete_bar(3).length);
        });
    });
    suite('get_unique_category_list', function () {
        test('Will give me a list with nothing repeated.',  function () {
            assert.deepEqual(get_unique_category_list(), ["bar", "barz", "foo"]);
        });
    });
});

suite('sync.js', function () {
    suite('onload_sync', function () {

    });
    suite('save_local', function () {
        
    });
    suite('sync', function () {
        
    });
    suite('compare_resolve_JSON', function () {
        
    });
});
