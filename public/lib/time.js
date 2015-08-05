function get_time() {
    return Date.now();
}

function get_remaining_seconds(index) {
    if (BAR.bars[index].type == "count_up") {
        return (Date.now() - BAR.bars[index].stamp) / 1000;
    }
    BAR.bars[index]['remaining_seconds'] = Math.floor((BAR.bars[index].stamp / 1000 + BAR.bars[index].scope_value) - (Date.now() / 1000));
    get_relative_time_text(index);
} 

function get_relative_time_text(index) {
    var my_remaining_seconds = BAR.bars[index]['remaining_seconds'];
    var my_time_obj = BAR.bars[index]['time_obj'];
    trim_it();
    function trim_it () {
        if (my_time_obj.length != 0) { // continue to calculate time_text when there is anything of my_time_obj
            for (var i in my_time_obj) {
                if (my_remaining_seconds < my_time_obj[i]['value']) {
                    my_time_obj.splice(i, 1);
                    trim_it();
                }
                else { // in the case of remaining seconds being greater than the first position of the time_obj
                    var big_num = Math.floor(my_remaining_seconds / my_time_obj[0]['value']);
                    var small_num = my_remaining_seconds % my_time_obj[0]['value'];
                    BAR.bars[index]['time_text'] = big_num + ' '+ my_time_obj[0]['scope'];
                    if (my_time_obj[1]) { // seems to not be working
                        small_num = Math.floor(small_num / my_time_obj[1]['value'])
                        if (small_num != 0) {
                            BAR.bars[index]['time_text'] += ' ' + small_num + ' ' + my_time_obj[1]['scope'];
                        }
                    }
                }
            }
        }
        else { // only fired if the my_time_obj does not exist any longer. (Happens when the remaining seconds is less than 0)
            // I probably want to get to the point of calculating how much time has elapsed after 0
            BAR.bars[index]['time_text'] = '';
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