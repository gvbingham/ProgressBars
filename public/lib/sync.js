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
    // case stories
    // 1. computer is only device, no cloud
    //      a. adds bar refreshes, needs to see bar come back
    //      b. removes bar refreshes, needs to see bar still removed after refresh
    //      c. modifies bar, refreshes, needs to see modified bar after refresh.
    // 2. computer is only device, cloud
    //      // same as above but with : 
    //      a. adds bar with internet, refreshes with internet, needs to see utmost bar.
    //      b. adds bar without internet, refreshes with internet, needs to see the utmost bar.
    //      c. adds bar with internet, refreshes without internet, needs to see utmost bar.
    //      d. adds bar without internet, refreshes without internet, needs to see the utmost bar.
    // 3. computer is not only device,  no cloud
    //      // same as above but with  : 
    //      a. adds bar on computer and should see bar updated on phone
    //      b.   
    // 4. computer is not only device,  cloud
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
    for (var first_index in first) {
        if (first[first_index]['deleted']) {
            for (var last_index in last) {
                if (first[first_index]['id'] == last[last_index]['id']) {
                    first.splice(first_index, 1);    
                    last.splice(last_index, 1);    
                    remove_deleted();
                }
                if (last_index >= last.length - 1) { // at the end of the local array do one more thing.
                    first.splice(first_index, 1);
                }
            }
        }
    }
}

function compare_resolve_JSON() {
    var goog = data.goog.content.bars;
    var local = BAR.bars;
    var exists = false;
    for (var goog_index in goog) {
        var goog_id = goog[goog_index].id;
        for (var local_index in local) {
            var local_id = local[local_index].id;
            if (goog_id == local_id) {
                exists = true;
                if (local[local_index]['deleted'] || goog[goog_index]['deleted']) {// you may need to be outside of the goog_id == local_id; this just isn't firing.
                    compare_resolve_JSON();
                }
                else {// if not deleted go on to resolve
                    local[local_index] = resolve(goog[goog_index], local[local_index]);
                }
            }
        }
        if (exists == false) {
            BAR.bars.push(goog[goog_index]);    
        }
        exists = false;
    }
    goog_create_or_update_app_folder_file();
    save_local(); 
    data.need_refresh_display = true;
    function resolve(goog_temp, local_temp) {
        if (goog_temp.updated >= local_temp.updated) {
            return goog_temp;//goog wins 
        }
        if (goog_temp.updated < local_temp.updated) {
            return local_temp;//local wins 
        }
    }
}
