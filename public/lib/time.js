function get_time() {
    return Date.now();
}

function get_remaining_seconds(index) {
    if (BAR.bars[index].type == "count_up") {
        BAR.bars[index]['remaining_seconds'] = Math.floor((Date.now() - BAR.bars[index].stamp) / 1000);
    }
    else {
        BAR.bars[index]['remaining_seconds'] = Math.floor((BAR.bars[index].stamp / 1000 + BAR.bars[index].scope_value) - (Date.now() / 1000));
    }
    get_relative_time_text(index);
} 

function get_relative_time_text(index) {
    var my_remaining_seconds = BAR.bars[index]['remaining_seconds'];
    if (my_remaining_seconds <= 0) { // if zero don't do any more calculating just exit function
        BAR.bars[index]['time_text'] = ''; 
        return;
    }
    var my_time_obj = BAR.bars[index]['time_obj'];
    for (var i in my_time_obj) {
        var big_s = '';
        var small_s = '';
        if (my_remaining_seconds >= my_time_obj[i]['value']) {

            // Do big number stuff
            var big_num = Math.floor(my_remaining_seconds / my_time_obj[i]['value']);
            if (big_num > 1) {big_s = 's'}
            BAR.bars[index]['time_text'] = big_num + ' ' + my_time_obj[i]['scope'] + big_s;

            // Do small number stuff
            if (i < my_time_obj.length - 1) { // if at last point on time_obj (seconds) should not have a smaller number
                var small_num = my_remaining_seconds % my_time_obj[i]['value'];
                small_num = Math.floor(small_num / my_time_obj[Number(i) + 1]['value']);
                if (small_num > 1) {small_s = 's'}
                if (small_num == 0) { // Don't put 4 Weeks 0 Days but put just 4 Weeks
                    break;
                }
                BAR.bars[index]['time_text'] += ' ' + small_num + ' ' + my_time_obj[Number(i) + 1]['scope'] + small_s;
            }
            break;
        }       
    }
}

function reset_time_obj(index) {
    BAR.bars[index]['time_obj'] = create_time_object;
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