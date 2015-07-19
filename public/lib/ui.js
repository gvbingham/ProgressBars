function toggle_add_popup_display() {
    var state = document.querySelector('#add_modify_container').style.display;
    document.querySelector('#add_modify_popup').style.display = (state == 'none' || state == '') ? 'block' : 'none';
    document.querySelector('#add_modify_container').style.display = (state == 'none' || state == '') ? 'flex' : 'none';
}
function toggle_choosecloud_popup_display() {
    var state = document.querySelector('#add_modify_container').style.display;
    document.querySelector('#choosecloud_popup').style.display = (state == 'none' || state == '') ? 'block' : 'none';
    document.querySelector('#choosecloud_container').style.display = (state == 'none' || state == '') ? 'flex' : 'none';
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
    sync();
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
