//Sync is needing to be more module if you will use this outside of this project.
function get_local() {
    return JSON.parse(localStorage.Bars);
}

function save_local() {
    localStorage.Bars = JSON.stringify(BAR.bars);
}

function sync() {
    gapi.client.load('drive', 'v2'); //I'm in the comment below remove me here once below is completed
    /*
    BAR.bars = get_local();
    if (BAR.settings.cloud.goog == 1) {
        check google auth
        gapi.client.load('drive', 'v2');
        overwrite the BAR object with what google drive has    
    }
    */



    BAR.bars = get_local();
    data.need_refresh = true;

    // Need to get this working for google api's this little guy will load the client so you can do things like gapi.client.drive.files
    //populate_category_header();
}
