//Sync is needing to be more module if you will use this outside of this project.
function get_local_bars() {
    return JSON.parse(localStorage.Bars);
}

function get_local_settings() {
    return JSON.parse(localStorage.settings);
}

function get_local_stamp() {
    return JSON.parse(localStorage.stamp);
}

function save_local() {
    var now = Date.now();
    BAR.stamp = now;
    localStorage.bars = JSON.stringify(BAR.bars);
    localStorage.settings = JSON.stringify(BAR.settings);
    localStorage.stamp = now;
    sync();
}

function onload_sync() { //initial update of local memory from local Storage
    if (localStorage.bars != undefined) {
        BAR.bars = get_local_bars(); 
    }
    if (localStorage.settings != undefined) {
        BAR.settings = get_local_settings();
    }
    if (localStorage.stamp != undefined) {
        BAR.stamp = get_local_stamp();
    }
    sync();
}

function sync() {//used to get all cloud items and local storage. compare them, and make a decision.
    if (BAR.settings.cloud.google == 1) {
        goog_app_file_get(function (){
            var goog = BAR.settings.goog.content;
            function goog_wins() {
                if (goog.stamp > BAR.stamp) {//Google Wins
                    BAR = BAR.settings.goog.content
                }
            }
        });
    }

    data.need_refresh = true; // what do I do again? 

    // Need to get this working for google api's this little guy will load the client so you can do things like gapi.client.drive.files
    //populate_category_header();
}
