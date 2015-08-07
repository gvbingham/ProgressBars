function onload_sync() { //initial update of local memory from local Storage
    var context = ['bars', 'settings', 'stamp'];
    for (var i in context) {
        if (localStorage[context[i]] != undefined) {
            BAR[context[i]] = JSON.parse(localStorage[context[i]]);
        }
    }
    display();
    if (BAR.settings.cloud.google == 1) {
        goog_set_up_app(); 
        display();
    }
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
            'fileId': data.goog.app_file_id,
            'alt' : 'media'
        });
        request.execute(function(resp) {
            var goog = resp.result;
            console.log(goog);
            if (goog.stamp > BAR.stamp) {
                compare_resolve_JSON();
            }
            else {
                goog_create_or_update_app_folder_file();
                save_local();  
            }
        });
    }
    else {
        save_local();
    }
    display();
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
            BAR.bars.push(goog[goog_index]);    
        }
        exists = false;
    }
    goog_create_or_update_app_folder_file();
    save_local(); 
    function resolve(goog_temp, local_temp) {
        if (goog_temp.updated >= local_temp.updated) {
            return goog_temp;//goog wins 
        }
        if (goog_temp.updated < local_temp.updated) {
            return local_temp;//local wins 
        }
    }
}
