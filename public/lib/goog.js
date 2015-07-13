var CLIENT_ID = '791463501485-t6cr3ojjbsdh1vpfj7532u78cb5qqpov.apps.googleusercontent.com';
var APIKEY = 'AIzaSyC9ygrH_0wszsBc6xxV9lXGLuDikDKiSio'; //maybe don't need
var SCOPES = ['https://www.googleapis.com/auth/drive.appfolder', 'https://www.googleapis.com/auth/drive.file'];


function goog_set_up_app() {
    BAR.settings.cloud.google = 1; 
    save_local();
    goog_load_google_api_client();
}

function goog_load_google_api_client() {
    if (gapi.client.drive == undefined) { // if not already loaded
        gapi.client.load('drive', 'v2').then(function() { // pre-load the client
            goog_check_auth();
        }); 
    }
    else {
        goog_check_auth();
    }
}

function goog_check_auth() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult
    );
}


function goog_create_or_update_app_folder_file (json_raw) {
    json_raw = jason_raw || BAR;
    // json handling for json_raw argument
    var json_str = JSON.stringify(json_raw);
    json_str = btoa(json_str);

    
    // Imutable data for header construction
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";


    // metadata needed for more header construction
    var metadata = {
      'title': 'app.json',
      'mimeType': 'application/json',
      'parents' : [{'id' : 'appfolder'}]
    };


    // more header construction 
    var multipart_request_body =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        json_str +
        close_delim;


    // and even more construction 
    var request_obj = {
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipart_request_body
    };
    if (BAR.settings.goog.app_file_id) { // if file does exist or application does know about the file 
        request_obj.path = '/upload/drive/v2/files/' + BAR.settings.goog.app_file_id;
        request_obj.method = 'PUT';
        request_obj.params.alt = 'json';
    }

    console.log(request_obj); //debug

    // load up the request into the client
    var request = gapi.client.request(request_obj);

    //execute the request and do something after
    request.execute(function(data) {
        BAR.settings.goog.app_file_id = data.id;
        console.log(data);
    });
}

function goog_get_app_folder_info () { // working
    var request = gapi.client.drive.files.get({
        'fileId': 'appfolder'
    });
    request.execute(function(resp) {
        BAR.settings.goog.app_folder_id = resp.id;
        BAR.settings.goog.app_folder_title = resp.title;
    });
}

function goog_get_app_folder_list () { // working
    var request = gapi.client.drive.files.list({
        'q': '\'appfolder\' in parents'
    });
    request.execute(function(resp) {
        console.log(resp.items);
    });
}

function goog_app_file_get (file_id) { // get the contents.
    file_id = file_id || BAR.settings.goog.app_file_id;
    var request = gapi.client.drive.files.get({
        'fileId': file_id,
        'alt' : 'media'
    });
    request.execute(function(resp) {
        BAR.settings.goog.content = resp.result;
        console.log(resp)
    });
}

function goog_app_file_delete (file_id) {// working
    file_id = file_id || BAR.settings.goog.app_file_id;
    var request = gapi.client.drive.files.delete({
        'fileId': file_id
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
        goog_get_app_folder_info();
    }
    else {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult
        );
    }
}
