function get_time() {
    return Date.now();
} 

function get_relative_time_difference (seconds) {
    var relative_time = {
        Years   : 31536000, 
        Months  : 2628000, 
        Weeks   : 604800, 
        Days    : 86400, 
        Hours   : 3600, 
        Minutes : 60, 
        Seconds : 1, 
    };
    for (var scope in relative_time) {
        var scope_seconds = relative_time[scope];
        if (seconds >= scope_seconds) {
            relative_time[scope] = Math.floor(seconds / scope_seconds)    
            seconds = seconds % scope_seconds;
        } 
        else {relative_time[scope] = 0}
    }
    return relative_time;
}

function get_relative_time_text (seconds) { //Will convert a number like this 1110203 to something like this "1 Week, 4 Days, 8 Hours, ... " etc.
    var time_obj = get_relative_time_difference(seconds);
    var temp_string = '';
    for (var scope in time_obj) {
        if (time_obj[scope] != 0) {
            temp_string += time_obj[scope] + ' ' + scope + ' ';
        } 
    }
    return temp_string;
}

function get_remaining_seconds(bars_index_num) {
    if (BAR.bars[bars_index_num].type == "count_up") {
        return (Date.now() - BAR.bars[bars_index_num].stamp) / 1000;
    }
    return Math.floor((BAR.bars[bars_index_num].stamp / 1000 + BAR.bars[bars_index_num].scope_value) - (Date.now() / 1000)) 
}

function get_how_many_seconds_to_date (date) {
    //var date_value = document.querySelector('#input_date').value;
    var seconds;
    if (date) {
        return Math.floor((Date.parse(date) / 1000) - (Date.now() / 1000));
    }
    else {
        throw 'you did not specify a date';
    }
}

function get_how_many_seconds_to_time (time) {
    //var time_string = document.querySelector('#input_time').value;
    if (time !== "") {
        var time_array = time.split(':');
        var hour = Number(time_array[0]);
        var minute = Number(time_array[1]);
        hour = hour * 3600;
        minute = minute * 60;
        return hour + minute;
    }
    else {
        throw new Error('you did not specify a date');
    }
}


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
};

data.fib_values = (function () {
    var relative_time = data.relative_time;
    var fib = data.fib;
    var temp = [];
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
    args = args || {};
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
            return x;
        }     
    }
    return 'not found';
}

function delete_bar (id) {
    var index = get_index_by_id(id);
    //put if statement on if not found
    BAR.bars.splice(index, 1);
    display();
    save_local();
}

function update_bar (id, args) {
    var index = get_index_by_id(id);
    var my_bar = BAR.bars[index];
    for (var key in args) {
        //Need logic for handing of history (which is an array)
        if (my_bar[key] !== undefined) {
            my_bar[key] = args[key];
        }
    }
    BAR.bars[index] = my_bar;
    display();
}

function reset_bar (id) {
    // Need to get if check on 'not found'
    update_bar(id, {stamp : Date.now()});
    save_local();
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
                var fib_seconds_index = parseInt(fib_seconds_index);
                if (diff >= fib_values[fib_seconds_index] && diff <= fib_values[fib_seconds_index + 1]) {
                    return (diff - fib_values[fib_seconds_index]) / (fib_values[fib_seconds_index + 1] - fib_values[fib_seconds_index]) * 100;
                }
            }
        }
    }
    else { //fail gracefully
        console.warn('bar ' + index + ' may need to be fixed or updated. It\'s type doesn\'t equal a defined type')
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

////////////////////////
// Category Functions //
////////////////////////

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

//////////////////
// UI Functions //
//////////////////
function toggle_add_popup_display() {
    var state = document.querySelector('#add_modify_container').style.display;
    document.querySelector('#add_modify_popup').style.display = (state == 'none' || state == '') ? 'block' : 'none';
    document.querySelector('#add_modify_container').style.display = (state == 'none' || state == '') ? 'flex' : 'none';
}


function toggle_add_options(whatami) {
    var iamnot = {
        fieldset_count_up : document.querySelector("#fieldset_count_up"),
        fieldset_interval : document.querySelector("#fieldset_interval"),
        fieldset_target : document.querySelector("#fieldset_target"),
    };
    var count_up_button = document.querySelector("#count_up_button");
    var iam = iamnot['fieldset_' + whatami];
    delete iamnot['fieldset_' + whatami];
    iam.removeAttribute("disabled");
    for (var key in iamnot) {
        iamnot[key].setAttribute("disabled", "disabled")
    }
    if (whatami == "count_up"){
        count_up_button.className = "count_up_enabled";
    }
    else {
        count_up_button.className = "count_up_disabled";
    }
}

function change_category(new_category) {
   BAR.settings.current_category = new_category;
   save_local();
   display();
}

function add() { //revisit fix
    var temp_bar = { //ok
        title       : document.getElementById('input_title').value,
        description : document.getElementById('input_description').value,
        category    : document.getElementById('input_category').value,
    };
    if (document.getElementById('fieldset_interval').disabled != true) {
        temp_bar.value = document.getElementById('interval_input_value').value;
        temp_bar.scope = document.getElementById('scope_dropdown').value;
    }
    else if (document.getElementById('fieldset_target').disabled != true) {
        temp_bar.date = document.querySelector('#input_date').value;
        temp_bar.time = document.querySelector('#input_time').value;
    }
    else if (document.getElementById('fieldset_count_up').disabled != true) { //get this fixed.
        temp_bar.type = "count_up";
    }
    BAR.bars.push(new create_bar(temp_bar));
    save_local();
    display();
    reset_form();
}

function reset_form() {
    document.getElementById('add_modify_popup').style.display = 'none';
    document.getElementById('add_modify_container').style.display = 'none';
    document.getElementById('input_title').value              = null;
    document.getElementById('input_description').value        = null;
    document.getElementById('input_category').value           = null;
    document.getElementById('interval_input_value').value     = null;
    document.getElementById('input_date').value               = null;
    document.getElementById('input_time').value               = null;
    document.getElementById('scope_dropdown').selected        = 'Seconds';
}

function display() { //Used to first draw all in the viewed category
    ////////////////////////
    // Templating of Bars //
    ////////////////////////
    var bar_html_source = document.getElementById('bar_html').innerHTML;
    var template = Handlebars.compile(bar_html_source);
    var tmpstring = "";
    for (var i in BAR.bars) {
        if (BAR.bars[i].category === BAR.settings.current_category || BAR.settings.current_category === "all") {
            tmpstring += template(BAR.bars[i]); 
            //tmpstring += (BAR.bars[i].category == category) ? bar_container + BAR.bars[i].svg + '</div>' : "";
        }
    } 
    document.getElementById("bars_container").innerHTML = tmpstring;

    //////////////////////////////
    // Templating of Categories //
    //////////////////////////////
    var tmpstring = ""; //ok
    var categories = get_unique_category_list(); //ok
    tmpstring += '<option value="all"selected>all</option>';
    for (var i in categories) {
        if (categories[i] == BAR.settings.current_category) {
            tmpstring += '<option value="' + categories[i] + '"selected>' + categories[i] + '</option>';
        }
        else {tmpstring += '<option value="' + categories[i] + '">' + categories[i] + '</option>';  }
    } 
    document.getElementById("select_category").innerHTML = tmpstring;
}

function get_target_seconds(date, time) {
    var secs_to_date = get_how_many_seconds_to_date(date);
    var secs_to_time = get_how_many_seconds_to_time(time);
    return secs_to_date + secs_to_time;
}

function sort_execute (arr, type) {
    BAR.bars = sort_array(arr, type);
    save_local();
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
////////////////////////////
// localStorage functions //
////////////////////////////

function get_local() {
    BAR.bars = JSON.parse(localStorage.Bars);
}

function save_local() {
    localStorage.Bars = JSON.stringify(BAR.bars);
}

function sync() {
    get_local();
    display();
    //populate_category_header();
}
