///////////////////
// BAR Functions //
///////////////////
var BAR = BAR || {
    settings : {
        current_category : 'all',
        cloud : {
            google : 0,
            dropbox : 0,
            btsync : 0,
            amazon : 0,
        },
    },
    bars : [],
};
var data = {
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
    goog : {},
    need_sync : false,
};

data.fib_values = (function () {
    var relative_time = data.relative_time;
    var fib = data.fib;
    var temp = [0];
    for (var temp_index in relative_time) {
        for (var temp_fib_index in fib) {
            if (fib[temp_fib_index] <= relative_time[temp_index].cap) { // only to the cap
                temp.push(relative_time[temp_index].value * fib[temp_fib_index]); 
            }
        }
    }
    return temp;
})()

function create_time_object (reverse) {
    var scopes = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];
    var values = [31536000, 2628000, 604800, 86400, 3600, 60, 1];
    var nexts = ['Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds', null];
    var caps = [55, 8, 3, 5, 21, 55, 55];
    var obj = [];
    for (var index in scopes) {
        obj.push({
            'scope' : scopes[index], 
            'value' : values[index], 
            'next' : nexts[index], 
            'caps' : caps[index],
        });
    }
    if (reverse) {
        obj.reverse(); 
    }
    return obj;
}

function create_bar_common(args) {
    args = args || {};
    var time = get_time();
    var obj = {};

    obj.id          = create_id();
    obj.title       = args.title       || 'New bar - ' + Math.round(Date.now() / 1000);
    obj.description = args.description || null;
    obj.category    = args.category    || 'main';
    obj.created     = args.created     || time;
    obj.updated     = args.updated     || time;
    obj.stamp       = args.created     || time;
    obj.history     = args.history     || [];
    obj.type        = args.type        || 'interval';
    obj.color       = 'blue';
    if (obj.type == 'interval') {
        obj.scope    = args.scope || null;
        obj.value    = args.value || null;
    }
    else if (obj.type == 'target') {
        obj.date     = args.date  || null;
        obj.time     = args.time || null;
        obj.scope    = 'Seconds';
        obj.value    = get_target_seconds(obj.date, obj.time);
    }
    else if (obj.type == 'count_up') {
        obj.color = 'lightBlue';
        obj.scope = null;
        obj.value = null;
    }
    obj.time_obj = create_time_object();
    obj.scope_value = get_scope(obj.scope, obj.value) || 60 * 5; //abmiguous possible place for optimization
    data.need_sync = true;
    return obj;
}

function get_scope(scope, value) {
    return data.time[scope] * value; 
}

function get_categories_list() {
    var temp_array = [];
    for (var i in BAR.bars) {
        temp_array.push(BAR.bars[i].category); 
    }
    return temp_array;
}

function create_id(num) { //create id like 
    num = num || 5;
    var tmp_string = '';
    for(var i = 0; i <= num; i++){
        tmp_string += data.char_set.charAt(Math.floor(Math.random() * 62));
    } 
    return tmp_string;
}

function get_index_by_id (id) { //get the index of the bar providing the id of the bar
    for (var x in BAR.bars) {
        if (BAR.bars[x].id == id){
            return Number(x);
        }     
    }
}


function delete_bar (index) {
    BAR.bars.splice(index, 1);
    data.need_sync = true;
    return BAR.bars;
}

function update_bar (index, args) {
    var my_bar = BAR.bars[index];
    for (var key in args) {
        //Need logic for handing of history (which is an array)
        if (my_bar.hasOwnProperty(key)) {
            my_bar[key] = args[key];
        }
    }
    my_bar.updated = get_time();
    data.need_sync = true;
    return my_bar;
}

function reset_bar (index) {
    // Need to get if check on 'not found'
    BAR.bars[index]['time_obj'] = create_time_object();
    data.need_sync = true;
    return update_bar(index, {stamp : Date.now()});
}

function get_percent (index, sort) {
    var diff = (Date.now() - BAR.bars[index].stamp) / 1000;
    if (BAR.bars[index].type == 'interval') {
        var percent = function () {
            return 100 - (diff / BAR.bars[index].scope_value) * 100;
        }
    }
    else if (BAR.bars[index].type == 'reverse_count_down') {
        var percent = function () {
            return (diff / BAR.bars[index].scope_value) * 100;
        }
    }
    else if (BAR.bars[index].type == "count_up") {
        var percent = function () {
            var fib_values = data.fib_values;
            for (var fib_seconds_index in fib_values) {
                var fib_seconds_index = Number(fib_seconds_index);
                if (diff >= fib_values[fib_seconds_index] && diff <= fib_values[fib_seconds_index + 1]) {
                    return (diff - fib_values[fib_seconds_index]) / (fib_values[fib_seconds_index + 1] - fib_values[fib_seconds_index]) * 100;
                }
            }
        }
    }
    else { //fail gracefully
        return 0;
    }
    // percent scrubber
    var cent = percent();
    if (sort) {
        BAR.bars[index].percent = cent;
    }
    if (cent > 100) {
        return 100;     
    }
    else if (cent < 0) {
        return 0; 
    }
    else {
        return cent;
    }
}

function get_unique_category_list () {
    var array = get_categories_list();
    temp_array = [];
    for (var i in array) {
        if (temp_array.indexOf(array[i]) == -1) {
            temp_array.push(array[i]); 
        } 
    } 
    return temp_array.sort();
}

function get_target_seconds(date, time) {
    var secs_to_date = get_how_many_seconds_to_date(date);
    var secs_to_time = get_how_many_seconds_to_time(time);
    return secs_to_date + secs_to_time;
}


function sort_execute (arr, type) {
    BAR.bars = sort_array(arr, type);
    sync();
    display();
}

function change_category(new_category) {
   BAR.settings.current_category = new_category;
   sync();
   display();
}

function sort_array (arr, type) {
    //TODO also program in reverse sorting for each
    for (index in BAR.bars) {
        get_percent(index, 'sort'); 
    }
    if (type == 'alpha') {
        return arr.sort(function (a,b) {
            if (a.title > b.title) {
                return 1;
            }
            if (a.title < b.title) {
                return -1;
            }
            return 0;
        });
    }
    if (type == 'percent') {
        return arr.sort(function (a,b) {
            if (arr.indexOf(a) !== -1 || arr.indexOf(b) !== -1) {
                return a.percent - b.percent;
            }
        })
    }
    //TODO Add date added
}
