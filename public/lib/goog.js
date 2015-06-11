var CLIENT_ID = '791463501485-t6cr3ojjbsdh1vpfj7532u78cb5qqpov.apps.googleusercontent.com';
var APIKEY = 'AIzaSyC9ygrH_0wszsBc6xxV9lXGLuDikDKiSio'; //maybe don't need
var SCOPES = ['https://www.googleapis.com/auth/drive.appfolder', 'https://www.googleapis.com/auth/drive.file'];


function set_app_use_google() {
    if (BAR.settings.cloud.google != 1) { // set persistent user uses google drive
        BAR.settings.cloud.google = 1; 
        save_local();
    }
    load_google_api_client();
}

function load_google_api_client() {
    gapi.client.load('drive', 'v2').then(function() { // pre-load the client
        //gapi.client.setApiKey(APIKEY);
        checkAuth();
    }); 
}

function checkAuth() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult
    );
}

function insertfile () {
    var request = gapi.client.drive.files.insert({
        title : 'app.json',
        mimeType : 'application/json', 
    });
    request.execute(function(resp) {
        BAR.settings.app_file_id = resp.id;
        console.log(resp.id)
    });
}

function updatefile () {
    var json = {a:1, b:2};
    json = JSON.stringify(json);
    json = btoa(json);
    var http_text = 'Content-Type: application/json\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        json;
    console.log(http_text);
    var request = gapi.client.drive.files.update({
        fileId : BAR.settings.app_file_id,
        uploadType : 'media',
        body : http_text,
    });
    request.execute(function(resp) {
        console.log(resp)
    });
}

function get_app_folder_info () {
    var request = gapi.client.drive.files.get({
        'fileId': 'appfolder'
    });
    request.execute(function(resp) {
        BAR.settings.app_folder_id = resp.id;
        BAR.settings.app_folder_title = resp.title;
    });
}

function get_app_folder_list () {
    var request = gapi.client.drive.files.list({
        'q': '\'appfolder\' in parents'
    });
    request.execute(function(resp) {
        console.log(resp)
    });
}

function get_app_folder_get () {
    var request = gapi.client.drive.files.get({
        'fileId': '1ueAfvEANqas_9ggkgxqkAqbh3ZxdoevAMjESjXIwCywZ'
    });
    request.execute(function(resp) {
        console.log(resp)
    });
}

function get_app_folder_delete () {
    var request = gapi.client.drive.files.get({
        'fileId': '1ueAfvEANqas_9ggkgxqkAqbh3ZxdoevAMjESjXIwCywZ'
    });
    request.execute(function(resp) {
        console.log(resp)
    });
}

function handleAuthResult(authResult) {
    /*var authButton = document.getElementById('authorizeButton');
    var filePicker = document.getElementById('filePicker');
    authButton.style.display = 'none';
    filePicker.style.display = 'none';
    */
    if (authResult && !authResult.error) {
        get_app_folder_info();
    }
    else {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult
        );
    }
}

function put_app_file() {

}

function read_app_file() {

}
