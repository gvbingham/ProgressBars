//Sync is needing to be more module if you will use this outside of this project.
function get_local_bars() {
    return JSON.parse(localStorage.Bars);
}

function get_local_settings() {
    return JSON.parse(localStorage.settings);
}

function save_local() {
    localStorage.bars = JSON.stringify(BAR.bars);
    localStorage.settings = JSON.stringify(BAR.settings);
}

function onload_sync() { //initial update of local memory from local Storage
    if (localStorage.bars != undefined) {
        BAR.bars = get_local_bars(); 
    }
    if (localStorage.settings != undefined) {
        BAR.settings = get_local_settings();
    }
    sync();
}

function sync() {//used to get all cloud items and local storage. compare them, and make a decision.
    var localdata = function () {
        var temp = {};
        temp.bars = get_local_bars();
        temp.settings = get_local_settings();
        return temp;
    }
    var googledata = function () {
        return read_app_file();  
    }
    data.need_refresh = true; // what do I do again? 

    // Need to get this working for google api's this little guy will load the client so you can do things like gapi.client.drive.files
    //populate_category_header();
}
