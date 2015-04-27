
///////////////////
// BAR Functions //
///////////////////
var BAR = BAR || {
    settings : {
        current_category : 'all',
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
    need_refresh : true,
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

function create_bar(args) {
    if (args === undefined) {args = {}}
    var time = get_time();
    this.id          = create_id(); 
    this.title       = args.title || 'New bar - ' + Math.round(Date.now() / 1000); 
    this.description = args.description || null;
    this.category    = args.category || 'main';
    this.created     = args.created || time;
    this.stamp       = args.created || time;
    this.history     = args.history || []; 
    this.type        = args.type || 'count_down';
    this.scope       = args.scope || null;
    this.value       = args.value || null;
    this.date        = args.date || null;
    this.time        = args.time || null;
    if (this.date && this.time) {
        this.scope = 'Seconds';    
        this.value = get_target_seconds(this.date, this.time);
    }
    if (this.type == 'count_up') {
        this.color = 'lightBlue';
    }
    else {
        this.color = 'blue';
    }
    this.scope_value = get_scope(this.scope, this.value) || 60 * 5; 
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

function create_id() { //create id like 
    var tmp_string = '';
    for(var i = 0; i <= 5; i++){
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

function delete_bar (id) {
    var index = get_index_by_id(id);
    //put if statement on if not found
    BAR.bars.splice(index, 1);
    data.need_refresh = true;
    save_local();
    return BAR.bars;
}

function update_bar (id, args) {
    var index = get_index_by_id(id);
    var my_bar = BAR.bars[index];
    for (var key in args) {
        //Need logic for handing of history (which is an array)
        if (my_bar.hasOwnProperty(key)) {
            my_bar[key] = args[key];
        }
    }
    return my_bar;
    //BAR.bars[index] = my_bar;
    //data.need_refresh = true;
    //save_local();
}

function reset_bar (id) {
    // Need to get if check on 'not found'
    return update_bar(id, {stamp : Date.now()});
}

function get_percent (index, sort) {
    var diff = (Date.now() - BAR.bars[index].stamp) / 1000;
    if (BAR.bars[index].type == 'count_down') {
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
    save_local();
    data.need_refresh = true;
}

function change_category(new_category) {
   BAR.settings.current_category = new_category;
   save_local();
   data.need_refresh = true;
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

function get_remaining_seconds(index) {
    if (BAR.bars[index].type == "count_up") {
        return (Date.now() - BAR.bars[index].stamp) / 1000;
    }
    return Math.floor((BAR.bars[index].stamp / 1000 + BAR.bars[index].scope_value) - (Date.now() / 1000)) 
}
(function draw_frame() {
    if (data.need_refresh) {
        display(); 
        data.need_refresh = undefined;
    }
    for (var i in BAR.bars) {
        if (BAR.settings.current_category == BAR.bars[i].category || BAR.settings.current_category == "all") { // if in same category
            if (document.getElementById('svg_' + BAR.bars[i].id)) {
                document.getElementById('svg_' + BAR.bars[i].id).style.width = get_percent(i) + '%';
            }
            if (document.getElementById('time_' + BAR.bars[i].id)) {
                document.getElementById('time_' + BAR.bars[i].id).innerHTML = get_relative_time_text(get_remaining_seconds(i));
            }
        }
    }
    //Draw the recalculation of time
    window.requestAnimationFrame(draw_frame);
})();
    
window.onload = sync;