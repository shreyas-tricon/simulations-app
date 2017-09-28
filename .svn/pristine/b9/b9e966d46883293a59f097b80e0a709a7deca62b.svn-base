cordova.define("org.ck12.identity.Identity", function(require, exports, module) { var exec = require('cordova/exec');
var platformId = require('cordova/platform').id;
var callbackWithError = require('org.chromium.common.errors').callbackWithError;


// TODO(maxw): Automatically handle expiration.
var cachedToken;
var cachedAccount;

// This constant is used as an error message when Google Play Services is unavailable during an attempt to get an auth token natively.
var GOOGLE_PLAY_SERVICES_UNAVAILABLE = -1;

// We use this constant to note when we don't know which account the token belongs to.  This happens when using the web auth flow.
var UNKNOWN_ACCOUNT = "Unknown account";

var authmaker =  {
};

authmaker.getAuthToken = function(details, callback) {

    if (typeof callback !== 'object') {
        alert('Callback object required to getAuthToken');
        return;
    }
    if (typeof callback.success !== 'function') {
        alert('Success callback required to getAuthToken');
        return;
    }
    if (typeof callback.error !== 'function') {
        alert('Error callback required to getAuthToken');
    }

    var callbackWithError = callback.error;
    var callback = callback.success;

    if (typeof details === 'undefined')  {
        details = { interactive: false };
    } 

    /*if (typeof details === 'function' && typeof callback === 'undefined') {
        callback = details;
        details = { interactive: false };
    }
    if (typeof callback !== 'function') {
        return callbackWithError('Callback function required');
    }
    if (typeof details !== 'object') {
        return callbackWithError('TokenDetails object required', callback);
    } */

    // If we have a cached token, send it along.
//    if (cachedToken) {
//        callback(cachedToken, cachedAccount);
//        return;
//    }

    // Fetch the OAuth details from either the passed-in `details` object or the manifest.
//    var oAuthDetails = details.oauth2 || authmaker.getManifest().oauth2;

    // Augment the callback so that it caches a received token.
    var augmentedCallback = function(tokenData) {
        if (tokenData.token) {
            cachedToken = tokenData.token;
        }
        if (tokenData.account) {
            cachedAccount = tokenData.account;
        }
        window.localStorage.setItem("cachedToken", cachedToken); 
        console.debug(cachedToken); 
        callback(tokenData.token, tokenData.account);
    };

    /* 
    // This function extracts a token from a given URL and returns it.
    var extractToken = function(url) {
        // This function is only used when using web authentication as a fallback from native Google authentication.
        // As a result, it's okay to search for "access_token", since that's what Google puts in the resulting URL.
        // The regular expression looks for "access_token=", followed by a lazy capturing of some string (the token).
        // This lazy capturing ends when either an ampersand (followed by more stuff) is reached or the end of the string is reached.
        var match = /\baccess_token=(.+?)(?:&.*)?$/.exec(url);
        return match && match[1];
    };*/

    // If we failed because Google Play Services is unavailable, revert to the web auth flow.
    // Otherwise, just fail.
    var fail = function(msg) {
        /*
        if (msg === GOOGLE_PLAY_SERVICES_UNAVAILABLE) {
            console.warn('Google Play Services is unavailable; falling back to web authentication flow.');

            // Verify that oAuthDetails contains a client_id and scopes.
            // Since we're using the web auth flow as a fallback, we need the web client id.
            var manifest = authmaker.getManifest();
            var webClientId = manifest && manifest.web && manifest.web.oauth2 && manifest.web.oauth2.client_id;
            if (!webClientId) {
                callbackWithError('Web client id missing from mobile manifest.', callback);
                return;
            }
            if (!oAuthDetails.scopes) {
                callbackWithError('Scopes missing from manifest.', callback);
                return;
            }

            // Add the appropriate URL to the `details` object.
            var scopes = encodeURIComponent(oAuthDetails.scopes.join(' '));
            details.url = 'https://accounts.google.com/o/oauth2/auth?client_id=' + webClientId + '&redirect_uri=' + chrome.identity.getRedirectURL() + '&response_type=token&scope=' + scopes;

            // The callback needs to extract the access token from the returned URL and pass that on to the original callback.
            var launchWebAuthFlowCallback = function(responseUrl) {
                var token = extractToken(responseUrl);

                // If we weren't able to extract a token, error out.
                if (!token) {
                    callbackWithError('URL did not contain a token.', callback);
                    return;
                }

                // Our augmented callback expects a token data object containing the token and the account.
                // We don't know the account, so we say so.
                var tokenData = { token: token, account: UNKNOWN_ACCOUNT };
                augmentedCallback(tokenData);
            };

            // Launch the web auth flow!
            authmaker.launchWebAuthFlow(details, launchWebAuthFlowCallback);
        } else {
            callbackWithError(msg, callback);
        } */
        callbackWithError(msg, callback);
    };

    // Use the native implementation for logging into Google accounts.
    oAuthDetails = {} ;
    var args = [!!details.interactive, oAuthDetails];
    if (details.accountHint) {
        args.push(details.accountHint);
    }
    exec(augmentedCallback, fail, 'ChromeIdentity', 'getAuthToken', args);
};

authmaker.removeCachedAuthToken = function(details, callback) {
    // Remove the cached token locally.
    console.log("Removing cached token...");
    cachedToken = window.localStorage.getItem("cachedToken"); 
    console.log(cachedToken);
 
    window.localStorage.removeItem("cachedToken")

    /*if (details && details.token === cachedToken) {
        cachedToken = null;
    }*/

    // Invalidate the token natively.
    //exec(callback, null, 'ChromeIdentity', 'removeCachedAuthToken', [details.token]);
    exec(callback, null, 'ChromeIdentity', 'removeCachedAuthToken', [cachedToken]);
}

authmaker.getAccounts = function(details, callback) {
    exec(callback, null, 'ChromeIdentity', 'getAccounts', []);
}

/*
authmaker.revokeAuthToken = function(details, callback) {
    // If a token has been passed, revoke it and remove it from the cache.
    // If not, call the callback with an error.
    if (details && details.token) {
        // Revoke the token!
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + details.token);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status < 200 || xhr.status > 300) {
                    console.log('Could not revoke token; status ' + xhr.status + '.');
                } else {
                    authmaker.removeCachedAuthToken({ token: details.token }, callback);
                }
            }
        }
        xhr.send(null);
    } else {
        return callbackWithError('No token to revoke.', callback);
    }
} */

/*
authmaker.getManifest = function() {
   manifestJson = { 
	"oauth2": {
	   //"client_id": "824097203574-ogrmrf0r7jasqglhl37uglh0magpjrt2.apps.googleusercontent.com",
	   "client_id": "",
	   "scopes": [
	      "https://www.googleapis.com/auth/userinfo.profile",
    	   ]
 	}
   };
   return manifestJson;
}

authmaker.launchWebAuthFlow = function(details, callback) {
    if (typeof callback !== 'function') {
        return callbackWithError('Callback function required');
    }
    if (typeof details !== 'object') {
        return callbackWithError('WebAuthFlowDetails object required', callback);
    }

    launchInAppBrowser(details.url, details.interactive, callback);
};

authmaker.getRedirectURL = function(path) {
    return 'https://' + chrome.runtime.id + '.chromiumapp.org/' + (path ? path : '');
};

function getAllParametersFromUrl(url, startString, endString) {
    if (typeof url !== 'undefined' && typeof startString !== 'undefined')
        url = url.split(startString)[1];
    if (typeof url !== 'undefined' && typeof endString !== 'undefined')
        url = url.split(endString)[0];
    if (typeof url === 'undefined')
        return {};

    var retObj = {};
    url.split('&').forEach(function(arg) {
        var pair = arg.split('=');
        retObj[pair[0]] = decodeURIComponent(pair[1]);
    });
    return retObj;
} 

function launchInAppBrowser(authURL, interactive, callback) {
    var oAuthBrowser = window.open(authURL, '_blank', 'hidden=yes');
    var success = false;
    var timeoutid;
    oAuthBrowser.addEventListener('loadstart', function(event) {
        if (success)
            return;
        if (timeoutid)
            timeoutid = clearTimeout(timeoutid);
        var newLoc = event.url;

        // When the location address starts with our redirect URL, we're done.
        if (newLoc.indexOf(authmaker.getRedirectURL()) == 0) {
            success = true;
        }

        if (success) {
            oAuthBrowser.close();
            callback(newLoc);
        }
    });
    oAuthBrowser.addEventListener('loadstop', function(event) {
        timeoutid = setTimeout(function() { // some sites use js redirects :(
            if (success)
                return;
            if (interactive)
                oAuthBrowser.show();
            else
                oAuthBrowser.close();
        }, 250);
    });
    oAuthBrowser.addEventListener('loaderror', function(event) {
        timeoutid = setTimeout(function() { // some sites use js redirects :(
            if (success)
                return;
            if (interactive)
                oAuthBrowser.show();
            else
                oAuthBrowser.close();
        }, 250);
    });
    oAuthBrowser.addEventListener('exit', function(event) {
        if (success)
            return;
        callback();
    });
}*/
module.exports = authmaker;

});
