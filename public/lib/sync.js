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
    //populate_category_header();
}