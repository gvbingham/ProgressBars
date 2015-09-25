function onload_sync() { //initial update of local memory from local Storage
    var context = ['bars', 'settings', 'stamp'];
    for (var i in context) {
        if (localStorage[context[i]] != undefined) {
            BAR[context[i]] = JSON.parse(localStorage[context[i]]);
        }
        else if (context[i] == 'stamp') {
            BAR.stamp = 0;
            localStorage.stamp = 0;
        }
    }
    data.need_refresh_display = true;
    if (BAR.settings.cloud.google == 1) {
        goog_set_up_app(); 
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
            data.goog.content = resp.result;
            if (resp.result.stamp > BAR.stamp) {
                compare_resolve_JSON();
            }
            else { // is save_local necesary here? 
                goog_create_or_update_app_folder_file();
                save_local();  
            }
        });
    }
    else {
        save_local();
        data.refresh_display = true;
    }
    //populate_category_header();
}

function remove_deleted(first, last) {
    var deleted_ids = [];
    for (var arg_index in arguments) {
        var i = arguments[arg_index].length;
        var arg_obj = arguments[arg_index];
        while (i--) {
            var bar = arg_obj[i];
            var deleted = false;
            if (arg_index != 0) {// if not the first go around
                check_deleted_ids(bar);
                if (deleted == false && bar && bar['deleted']) {
                    delete_it(bar, 'push');
                }
            }
            else if (bar['deleted']) {
                delete_it(bar, 'push');
            }
        }
    }
    function check_deleted_ids (obj) {
        for (var ids_index in deleted_ids) {
            if (deleted_ids[ids_index] == obj['id']) {
                delete_it(obj);
                deleted = true;
                break;
            }
        } 
    }
    function delete_it (obj, push) {
        if (push) {
            deleted_ids.push(obj['id']);   
        }
        arg_obj.splice(i, 1);
    }
}

function compare_resolve_JSON() {
    var goog = data.goog.content.bars;
    var local = BAR.bars;
    remove_deleted(local, goog); 
    var exists = false;
    for (var goog_index in goog) {
        var goog_id = goog[goog_index].id;
        for (var local_index in local) {
            var local_id = local[local_index].id;
            if (goog_id == local_id) {//Compare ids when they match ...
                exists = true;
                local[local_index] = resolve(goog[goog_index], local[local_index]); // Make local whatever won the resolve.
            }
        }
        if (exists == false) {
            BAR.bars.push(goog[goog_index]);// Needed to be there in the case that goog bar doesn't exist or no match was found
        }
        exists = false;
    }
    goog_create_or_update_app_folder_file();
    save_local(); 
    data.need_refresh_display = true;
    function resolve(goog_temp, local_temp) {
        if (goog_temp.updated >= local_temp.updated) { // Compare updated time stamps
            return goog_temp;//goog wins 
        }
        if (goog_temp.updated < local_temp.updated) {
            return local_temp;//local wins 
        }
    }
}
