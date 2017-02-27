/*
    Functions to access Gmail with oauth2.
        genPermissionUrl(...)
        getAuthTokens(...)
        
*/
 
var querystring = require("querystring");
var request = require('request');

//TODO: reset keys n move sensitive info to external file
// Keys n Constants
var GOOGLE_CLIENT_ID = '788164556802-77032h0shl056j1jkdpv58irspq6kavj.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = '-g2U1yx5rnajiQub9y5CJPc8'; //should be kept secret
var BASE_URL = 'https://accounts.google.com/';

/*
	googleapis with oauth2client

*/
var googleapis = require('googleapis');
var OAuth2Client = googleapis.auth.OAuth2;
var oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, constants.REDIRECT_URI);

//request new access token and callback
exports.genNewAccessToken = function(token, callback){
	var googleapis = require('googleapis');
	var OAuth2Client = googleapis.auth.OAuth2;
	var oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, constants.REDIRECT_URI);
	oauth2Client.credentials = token;
	oauth2Client.refreshAccessToken(callback);
}


/* Generates a url that needs to be visited to get an authorization 
 * code. Redirect url is the url that will be visited after the 
 * user authorizes.
 * login_hint(optional) can be the user's email address and will help 
 *    automatically choose the corrct user in google concent screen 
*/
exports.genPermissionUrl = function (redirect_uri, login_hint){
    if (typeof redirect_uri != 'string'){
        console.log('Error:oauth.js:genPermissionUrl:Invalid Redirect Url')
        return
    }
    var parms = { 
        client_id: GOOGLE_CLIENT_ID, 
        redirect_uri: redirect_uri, 
        scope: 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email',
        approval_prompt: 'force',
        access_type: 'offline',
        response_type: 'code',
        login_hint: login_hint || ''
        };
    var url = BASE_URL+'o/oauth2/auth?'+querystring.stringify(parms);    
    return url;
};

/*
 * Get the authorization tokens. 
 *   Send a POST request to url with the required parms. 
 *   A json with tokens will be returned (or error on failure). 
 *   Run the callback function when the json is ready (or if failed).
 *      callback(null, obj) when success
 *      callback('error') when fail
*/
exports.getAuthTokens = function (auth_code, redirect_uri, callback){
    if (typeof redirect_uri != 'string'){
        console.log('Error:oauth.js:getAuthTokens:Invalid Redirect Url')
        return
    }
    var parms = { 
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code: auth_code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
        };
    
    var url = BASE_URL+'o/oauth2/token';
    
    request.post(url, {form:parms}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, JSON.parse(body));
        }
        else{
            console.log('Error:oauth.js:getAuthTokens:request.post');
            callback('Error:oauth.js:getAuthTokens:request.post');
        }
    });
};


/**
 * Converts an access_token and user id into a base64 encoded XOAuth2 token
 *
 * @param {String} accessToken Access token string
 * @return {String} Base64 encoded token for IMAP or SMTP login
 */
exports.buildXoauth2Token = function(email, access_token){
    var authData = [
        "user=" + (email || ""),
        "auth=Bearer " + access_token,
        "",
        ""];
    return new Buffer(authData.join("\x01"), "utf-8").toString("base64");
};


