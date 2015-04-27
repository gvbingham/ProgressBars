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

function get_how_many_seconds_to_date (date) {
    //var date_value = document.querySelector('#input_date').value;
    var seconds;
    if (date && Date.parse(date) != NaN) {
        return Math.floor((Date.parse(date) / 1000) - (Date.now() / 1000));
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
}