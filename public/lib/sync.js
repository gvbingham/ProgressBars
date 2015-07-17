//Sync is needing to be more module if you will use this outside of this project.
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
    if (BAR.settings.cloud.google == 1) {
        goog_set_up_app(); 
    }
}

function get_local_bars() {
    return JSON.parse(localStorage.bars);
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
}

function sync() {//used to get all cloud items and local storage. compare them, and make a decision.
    if (BAR.settings.cloud.google == 1) {
        var request = gapi.client.drive.files.get({
            'fileId': BAR.goog.app_file_id,
            'alt' : 'media'
        });
        request.execute(function(resp) {
            var goog = resp.result;
            if (goog.stamp > BAR.stamp) {
                compare_resolve_JSON();
            }
            goog_create_or_update_app_folder_file();
            save_local(); 
        });
    }
    else {
        save_local();
    }

    data.need_refresh = true; // what do I do again? 

    // Need to get this working for google api's this little guy will load the client so you can do things like gapi.client.drive.files
    //populate_category_header();
}

function compare_resolve_JSON () {
    var goog = data.goog.content.bars;
    var local = BAR.bars;
    var exists = false;
    for (var goog_index in goog) {
        var goog_id = goog[goog_index].id;
        for (var local_index in local) {
            var local_id = local[local_index].id;
            if (goog_id == local_id) {
                exists = true;
                BAR[local_index] = resolve(goog[goog_index], local[local_index]);
            }
        }
        if (exists == false) {
            BAR.push(goog[goog_index]);    
        }
        exists = false;
    }
    function resolve(goog_temp, local_temp) {
        if (goog_temp.updated >= local_temp.updated) {
            return goog_temp;//goog wins 
        }
        if (goog_temp.updated < local_temp.updated) {
            return local_temp;//local wins 
        }
    }
}
