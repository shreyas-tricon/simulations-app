package org.ck12;

import java.io.IOException;

import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.text.TextUtils;

import android.accounts.AccountManager;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import android.accounts.Account;
import org.json.JSONArray;

import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.GooglePlayServicesAvailabilityException;
import com.google.android.gms.auth.UserRecoverableAuthException;
import com.google.android.gms.common.AccountPicker;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;

public class ChromeIdentity extends CordovaPlugin {

    private static final String LOG_TAG = "ChromeIdentity";

    // These are just unique request codes. They can be anything as long as they don't clash.
    private static final int AUTH_REQUEST_CODE = 5;
    private static final int ACCOUNT_CHOOSER_INTENT = 6;
    private static final int OAUTH_PERMISSIONS_GRANT_INTENT = 7;
    private static final int UPDATE_GOOGLE_PLAY_SERVICES_REQUEST_CODE = 8;

    // Error codes.
    private static final int GOOGLE_PLAY_SERVICES_UNAVAILABLE = -1;

    private String accountName = "";
    private CordovaArgs savedCordovaArgs;
    private CallbackContext savedCallbackContext;
    private boolean savedContent = false;
   
    /* Not necessary for the auth service through android native apis */   
    final private String CLIENT_ID = "824097203574-ogrmrf0r7jasqglhl37uglh0magpjrt2.apps.googleusercontent.com"; //lily
     
    /*final private List<String> SCOPES = Arrays.asList(new String[]{
       //  "https://www.googleapis.com/auth/plus.login",
       //  "https://www.googleapis.com/auth/drive",
       //  "https://www.googleapis.com/auth/userinfo.profile",
           "profile email"   
     });*/
    final private String[] SCOPES = {"profile email"};

    private class TokenDetails {
        private boolean interactive;
    }

    @Override
    public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext) throws JSONException {
        if ("getAuthToken".equals(action)) {
            getAuthToken(args, callbackContext);
            return true;
        } else if ("removeCachedAuthToken".equals(action)) {
            removeCachedAuthToken(args, callbackContext);
            return true;
        } else if ("getAccounts".equals(action)) {
            getAccounts(args, callbackContext);
            return true;
        }

        return false;
    }
   
    private void getAccounts(final CordovaArgs args, final CallbackContext callbackContext) {
        try {
        	AccountManager accountManager = AccountManager.get(this.cordova.getActivity());
   		Account[] accounts = accountManager.getAccountsByType("com.google");
                JSONArray anArray = new JSONArray();

		for (Account acc : accounts) {
        		String possibleEmail = acc.name;
	        	anArray.put(possibleEmail);       
    		}
	    	Log.e(LOG_TAG,"Google play accounts");
    		Log.e(LOG_TAG,anArray.toString());
                callbackContext.success(anArray);
        } catch (Exception e) {
            e.printStackTrace(); 
            callbackContext.error("Could not get the account details");
        }
    }

    //private String getScopesString(CordovaArgs args) throws IOException, JSONException {
    private String getScopesString() throws IOException {
        //JSONArray scopes = args.getJSONObject(1).getJSONArray("scopes");
        StringBuilder ret = new StringBuilder("oauth2:");
        /*
        for (int i = 0; i < scopes.length(); i++) {
            if (i != 0) {
                ret.append(" ");
            }
            ret.append(scopes.getString(i));
        }*/

        for (int i = 0; i < SCOPES.length; i++) {
            if (i != 0) {
                ret.append(" ");
            }
            ret.append(SCOPES[i]);
        }
        return ret.toString();
    }

    private TokenDetails getTokenDetailsFromArgs(CordovaArgs args) throws JSONException {
        TokenDetails tokenDetails = new TokenDetails();
        tokenDetails.interactive = args.getBoolean(0);
        return tokenDetails;
    }

    private boolean haveAccount() {
        boolean exist = !(accountName.isEmpty());
        if(exist) {  
                  exist = false;
                  AccountManager accountManager = AccountManager.get(this.cordova.getActivity());
                  Account[] accounts = accountManager.getAccountsByType("com.google");
                  for (Account acc : accounts) {
                      String possibleEmail = acc.name;
                      if(possibleEmail.equals(accountName)) {
                          Log.e(LOG_TAG, "ACCOUNT EXIST IN THE DEVICE");
                          exist = true;
                          break;
                      }
                  }
        }
        if(!exist) {
            accountName = "";
        }
        return exist;
    }

    private void launchAccountChooserAndCallback(CordovaArgs cordovaArgsToSave, CallbackContext callbackContextToSave) {
        // Check if Google Play Services is available.
        int availabilityCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this.cordova.getActivity());
        if (availabilityCode == ConnectionResult.SUCCESS) {
            this.savedCordovaArgs = cordovaArgsToSave;
            this.savedCallbackContext = callbackContextToSave;
            this.savedContent = true;

            // The "google.com" filter accepts both Google and Gmail accounts.
            Intent intent = AccountPicker.newChooseAccountIntent(null, null, new String[]{"com.google"}, false, null, null, null, null);
            this.cordova.startActivityForResult(this, intent, ACCOUNT_CHOOSER_INTENT);
        } else if (availabilityCode == ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED) {
            // Save our data.
            this.savedCordovaArgs = cordovaArgsToSave;
            this.savedCallbackContext = callbackContextToSave;
            this.savedContent = true;

            // Prompt the user to update Google Play Services.
            GooglePlayServicesUtil.getErrorDialog(availabilityCode, this.cordova.getActivity(), UPDATE_GOOGLE_PLAY_SERVICES_REQUEST_CODE).show();
        } else {
            // Fall back to the web auth flow.
            callbackContextToSave.error(GOOGLE_PLAY_SERVICES_UNAVAILABLE);
        }
    }

    private void launchPermissionsGrantPageAndCallback(Intent permissionsIntent, CordovaArgs cordovaArgsToSave, CallbackContext callbackContextToSave) {
        this.savedCallbackContext = callbackContextToSave;
        this.savedCordovaArgs = cordovaArgsToSave;
        this.savedContent  = true;
        this.cordova.startActivityForResult(this, permissionsIntent, OAUTH_PERMISSIONS_GRANT_INTENT);
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent intent) {
        // Enter only if we have requests waiting
        if (savedContent) {
            if (requestCode == ACCOUNT_CHOOSER_INTENT) {
                if (resultCode == Activity.RESULT_OK && intent.hasExtra(AccountManager.KEY_ACCOUNT_NAME)) {
                    accountName = intent.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
                    getAuthToken(this.savedCordovaArgs, this.savedCallbackContext);
                } else {
                    Log.e(LOG_TAG, "User declined to provide an account");
                    savedCallbackContext.error("1002");

                }
                this.savedContent = false;
                this.savedCallbackContext = null;
                this.savedCordovaArgs = null;
            } else if (requestCode == OAUTH_PERMISSIONS_GRANT_INTENT) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        if (resultCode == Activity.RESULT_OK) {
                            String token = null;
                            if (intent.hasExtra("authtoken")) {
                                token = intent.getStringExtra("authtoken");
                            } else {
                                try {
                                    //scope = "audience:server:client_id:" + CLIENT_ID;  // For JWT token
                                    //String scope = String.format("oauth2:server:client_id:%s:api_scope:%s",
                                    //              CLIENT_ID, TextUtils.join(" ", SCOPES)); // For cross-client token
                                    String scope = getScopesString(); // For native app auth token
                                    Log.e(LOG_TAG, "GOOGLE PLAY AUTH SERVICE SCOPE"+scope);

                                    //token = GoogleAuthUtil.getToken(cordova.getActivity(), intent.getExtras().getString("authAccount"), intent.getExtras().getString("service"));
                                    token = GoogleAuthUtil.getToken(cordova.getActivity(), intent.getExtras().getString("authAccount"), scope);
                                } catch (UserRecoverableAuthException e) {
                                    e.printStackTrace();
                                    savedCallbackContext.error("Auth Error: " + e.getMessage());
                                    return;
                                } catch (IOException e) {
                                    e.printStackTrace();
                                    savedCallbackContext.error("Auth Error: " + e.getMessage());
                                    return;
                                } catch (GoogleAuthException e) {
                                    e.printStackTrace();
                                    savedCallbackContext.error("Auth Error: " + e.getMessage());
                                    return;
                                }
                            }
                            if (token == null) {
                                savedCallbackContext.error("Unknown auth error.");
                            } else {
                                getAuthTokenCallback(token, savedCallbackContext);
                            }
                        } else {
                            Log.e(LOG_TAG, "User did not approve oAuth permissions request");
                            savedCallbackContext.error("1001");
                        }
                        savedContent = false;
                        savedCallbackContext = null;
                        savedCordovaArgs = null;
                    }
                });
            } else if (requestCode == UPDATE_GOOGLE_PLAY_SERVICES_REQUEST_CODE) {
                if (resultCode == Activity.RESULT_OK) {
                    // The user has updated Google Play Services.  Try again!
                    launchAccountChooserAndCallback(savedCordovaArgs, savedCallbackContext);
                } else {
                    // Google Play Services was not updated.
                    savedCallbackContext.error("Google Play Services is out of date.");

                    savedContent = false;
                    savedCallbackContext = null;
                    savedCordovaArgs = null;
                }
            }
        }
    }

    private void getAuthToken(final CordovaArgs args, final CallbackContext callbackContext) {
        this.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
              
                if(!haveAccount()) {
                    Log.e(LOG_TAG, "NOT HAVING ACCOUNT");
                    String accountHint = null;
                    try {
                        accountHint = args.getString(2);
                    } catch (JSONException e) { }
                    if (accountHint != null) {
                        accountName = accountHint;
                        getAuthTokenWithAccount(accountName, args, callbackContext);
                    } else {
                        launchAccountChooserAndCallback(args, callbackContext);
                    }
                } else {
                    Log.e(LOG_TAG, "HAVE ACCOUNT");
                    getAuthTokenWithAccount(accountName, args, callbackContext);
                }
            }
        });
    }

    private void getAuthTokenWithAccount(String account, CordovaArgs args, CallbackContext callbackContext) {
        String token = "";
        String scope = "";
        Context context = null;
        boolean done = true;
        TokenDetails tokenDetails = null;
        
        try {
            tokenDetails = getTokenDetailsFromArgs(args);
            //scope = "audience:server:client_id:" + CLIENT_ID; // For JWT token
            //scope = String.format("oauth2:server:client_id:%s:api_scope:%s", 
            //        CLIENT_ID, TextUtils.join(" ", SCOPES)); // For cross-client token
            scope = getScopesString(); // For native app auth token

            Log.e(LOG_TAG, "ACCOUNT :"+account);
            Log.e(LOG_TAG, "GOOGLE PLAY AUTH SCOPE :"+scope);
            
            context = this.cordova.getActivity();
            token = GoogleAuthUtil.getToken(context, account, scope);
            
        } catch (GooglePlayServicesAvailabilityException playEx) {
            // Play is not available
            if (tokenDetails.interactive) {
                Activity myActivity = this.cordova.getActivity();
                Dialog dialog = GooglePlayServicesUtil.getErrorDialog(playEx.getConnectionStatusCode(), myActivity , AUTH_REQUEST_CODE);
                dialog.show();
            } else {
                Log.e(LOG_TAG, "Google Play Services is not available", playEx);
            }
        } catch (UserRecoverableAuthException recoverableException) {
            // OAuth Permissions for the app during first run
            if(tokenDetails.interactive) {
                Intent permissionsIntent = recoverableException.getIntent();
                launchPermissionsGrantPageAndCallback(permissionsIntent, args, callbackContext);
                // If the user allows it then we need ask for the token again and pass the token to the success callback
                done = false;
            } else {
                Log.e(LOG_TAG, "Recoverable Error occured while getting token. No action was taken as interactive is set to false", recoverableException);
            }
        } catch(Exception e) {
            Log.e(LOG_TAG, "Error occured while getting token", e);
        }

        if(done) {
            getAuthTokenCallback(token, callbackContext);
        }
    }

    private void getAuthTokenCallback(String token, CallbackContext callbackContext) {
        if(token.trim().equals("")) {
            callbackContext.error("Could not get auth token");
        } else {
            try {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("account", accountName);
                jsonObject.put("token", token);
                callbackContext.success(jsonObject);
            } catch (JSONException e) { }
        }
    }

    private void removeCachedAuthToken(final CordovaArgs args, final CallbackContext callbackContext) {
        this.cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                invalidateToken(args, callbackContext);
            }
        });
    }

    private void invalidateToken(CordovaArgs args, CallbackContext callbackContext) {
        try {
            String token = args.getString(0);
            Context context = this.cordova.getActivity();
           
            if(token != null) { 
	        Log.e(LOG_TAG,"Removing the token");
	        Log.e(LOG_TAG, token);
                GoogleAuthUtil.invalidateToken(context, token);
                accountName = "";
            } else {
	        Log.e(LOG_TAG,"No token exist to invalidate");
            } 
            callbackContext.success();
        } catch (SecurityException e) {
            // This happens when trying to clear a token that doesn't exist.
            callbackContext.success();
        } catch (JSONException e) {
            callbackContext.error("Could not invalidate token due to JSONException.");
        }
    }
}
