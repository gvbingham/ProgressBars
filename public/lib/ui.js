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
    data.need_refresh = true;
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
