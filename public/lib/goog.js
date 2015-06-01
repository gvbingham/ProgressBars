var CLIENT_ID = '791463501485-t6cr3ojjbsdh1vpfj7532u78cb5qqpov.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive.appfolder';

/**
* Called when the client library is loaded to start the auth flow.
function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}
*/

/**
* Check if the current user has authorized the application.
*/
function checkAuth() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult
    );
}

/**
* Called when authorization server replies.
*
* @param {Object} authResult Authorization result.
*/
function handleAuthResult(authResult) {
    /*var authButton = document.getElementById('authorizeButton');
    var filePicker = document.getElementById('filePicker');
    authButton.style.display = 'none';
    filePicker.style.display = 'none';
    */
    if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        //filePicker.style.display = 'block';
        //filePicker.onchange = uploadFile;
    }
    else {
        // No access token could be retrieved, show the button to start the authorization flow.
        //authButton.style.display = 'block';
        var item = document.getElementById('header_container'); // HEY HEY HEY need to update this to a button or some start page
        item.onclick = function() {
            gapi.auth.authorize(
                {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                handleAuthResult
            );
        };
    }
}

function get_data_folder_info() {
    var request = gapi.client.drive.files.get({
        'fileId': 'appfolder'
    });
    request.execute(function(resp) {
        console.log('Id: ' + resp.id);
        console.log('Title: ' + resp.title);
    });
}

function put_app_file() {

}

function read_app_file() {

}
