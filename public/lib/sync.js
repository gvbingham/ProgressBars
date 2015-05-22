//Sync is needing to be more module if you will use this outside of this project.
function get_local() {
    return JSON.parse(localStorage.Bars);
}

function save_local() {
    localStorage.Bars = JSON.stringify(BAR.bars);
}

function sync() {
    BAR.bars = get_local();
    data.need_refresh = true;
    // Need to get this working for google api's this little guy will load the client so you can do things like gapi.client.drive.files
    gapi.client.load('drive', 'v2');
    //populate_category_header();
}
