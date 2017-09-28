
/* vim: set noexpandtab: */
window.readerAppHelper = {
    dbConnection:null,
    localConfig:{}, //for storing some local information in a session
    init : function(){
        document.addEventListener("deviceready", function(){
                                  statusbarTransparent.enable();
            document.addEventListener("backButton", function(){
                var isExit = true;
                if(typeof window.readerAppHelper.backButtonHandler === "function"){
                    isExit = !window.readerAppHelper.backButtonHandler();
                }
                if(isExit){
                    navigator.app.exitApp();
                }
            }, false);
            //StatusBar.show();  // No status bar
            //readerAppHelper.addAppVersionToMenu(); // No app version
            //readerAppHelper.checkForNetwork();
              // document.addEventListener("offline", readerAppHelper.checkForNetwork, false); //show error modal when network goes off in between
            document.addEventListener("online", function(){ //if user comes online and splash screeen is shown then again check for login
                $("#networkErrorModal,#networkErrorModalOverlay").addClass("hide");
                                      if(window.location.pathname.split( '/' ).pop()==="login.html" && !($(".app-container").hasClass("hide"))){
                                       $("#networkErrorModal,#networkErrorModalOverlay").addClass("hide");
                                      }

            }, false);

            window._platform = device.platform.toLocaleLowerCase();
            window.login_check = false;
            window.popupactive = false;
            console.log(window._platform)
            window.pageLoadTime = new Date(); // Check for push notifications.
            if(window._platform.match(/(iPad|iPhone|iPod|iOS)/gi)) window._platform = 'ios';
            if(window._platform.match(/(droid)/gi)) window._platform = 'android';
            window._device_model = device.model.toLocaleLowerCase();
            if(window.dexter){
                reader.dexterjs = window.dexterjs;
            }

        }, false);
    },
    initRootPath : function(path){
                       this.rootPath = path;
                       console.log("root path is " + this.rootPath);
                   },

    /*Start commenting code for app versioning */
checkAppVersion: function(onSuccessCallBack){
    'use strict';
    var versionOK = true;
    // var popupactive = false;
    // var branchesToInvalidate = [];
    // var numBranchesToInvalidate = 0;
    /*function onBranchInvalidated(){
     if(--numBranchesToInvalidate === 0){
     if(versionOK && !popupactive && onSuccessCallBack){
     onSuccessCallBack();
     }
     }
     }*/
    if(window.readerAppHelper){
        var lastVersionCheck = 1356978600000;//Jan 1 2013
        if(window.readerAppHelper.appLocalStorage){
            lastVersionCheck = window.readerAppHelper.appLocalStorage.getItem('lastVersionCheck') || lastVersionCheck;
        }
        if(Date.now() - lastVersionCheck > (24 * 60 * 59 * 1000)){ // once every day
            var networkState = null,
            networkModal = null;
              if (readerAppHelper.checkForServer()){
             // networkState = navigator.connection.type;
             // if(Connection.NONE !== networkState){
            $.get(window.API_SERVER_URL +'/assessment/api/app/versions?appName=ck12sims', function(data){
            	if (data.responseHeader.status === 0) {
            	    var installedVersion, supportedVersions;
            	    requirejs(['auth/js/version'], function(versionInfo) {
            	        installedVersion = versionInfo.major;
            	        supportedVersions = data.response.app_version_support[window._platform];
            	        if (supportedVersions !== null && supportedVersions !== undefined) {
            	            if (installedVersion < supportedVersions.current) {
            	                if (installedVersion >= supportedVersions.min) {
            	                    window.readerAppHelper.showUpdateAvailable(false);
            	                    window.readerAppHelper.appLocalStorage.setItem('lastVersionCheck', Date.now());
            	                }
            	                if (installedVersion < supportedVersions.min) {
            	                    window.readerAppHelper.showUpdateAvailable(true);
            	                }
            	                versionOK = false;
            	            } else {
            	                versionOK = true;
            	                window.readerAppHelper.appLocalStorage.setItem('lastVersionCheck', Date.now());
            	                if (onSuccessCallBack) onSuccessCallBack();
            	            }
            	        }
            	    });

            	    if (data.response.hasOwnProperty('popup_message')) {
            	        if (lastVersionCheck < Date.parse(data.response.popup_message.update_time)) {
            	            window.readerAppHelper.showModalPopup(
            	                data.response.popup_message.title,
            	                data.response.popup_message.body,
            	                data.response.popup_message.action,
            	                data.response.popup_message.action_label,
            	                data.response.popup_message.dismiss_label
            	            );
            	            window.popupactive = true;
            	        }
            	    }
            	}else {
            	    versionOK = true;
            	}

                  /*if(data.response.branch_updates){
                   var branch_updates = data.response.branch_updates;
                   for(var i = 0; i<branch_updates.length; i++){
                   if(lastVersionCheck < Date.parse(branch_updates[i].update_time)){
                   branchesToInvalidate.push(branch_updates[i].branch)
                   }
                   }
                   if(branchesToInvalidate.length > 0){
                   numBranchesToInvalidate = branchesToInvalidate.length;
                   $.getScript(cordova.file.applicationDirectory+'www/ui/public/lib/cache/cache_ajax.js',
                   (function(branchesToInvalidate){
                   return function(data, textStatus, jqxhr){
                   var smart_cache = new window.SmartCache();
                   while(branchesToInvalidate.length > 0){
                   branchToInvalidate = branchesToInvalidate.pop();
                   smart_cache.clear_region(branchToInvalidate,'ck12data',{
                   cachesuccess:onBranchInvalidated,
                   cachefailure:onBranchInvalidated
                   });
                   }
                   }
                   })(branchesToInvalidate)
                   );
                   }
                   }*/
                  // if(versionOK && branchesToInvalidate.length === 0 && !popupactive && onSuccessCallBack) onSuccessCallBack();

                  });
                } else if(versionOK && onSuccessCallBack){
                        onSuccessCallBack();
                    }
                }
        else if(versionOK && onSuccessCallBack){
            onSuccessCallBack();
        }
    }
},
	zipUnzipAllspark:function(){
		if(!window.localStorage.getItem('allspark')){
			window.readerAppHelper.copyFile()
		}else{
			if(!window.popupactive){
			window.readerAppHelper.checkLogin();
		}
		}



},
copyFile:function (){

	var baseUrl = location.href.replace("/index.html", "");
	var fp = "1.0.8.zip";
	var fileDestPath = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

	    var sourceFilePath = baseUrl + "/" +fp;
	   var targetFilePath = fileDestPath+"/1.0.8.zip";

	var ft = new FileTransfer();
	ft.download(
	                sourceFilePath,
	                targetFilePath,
	                function(entry){
	                	var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, refUrl = window.SIM_DWL_SRV+"/simulations/common/allspark/1.0.8.zip", uri = encodeURI(refUrl),
	            				fileURLzip = fileURL + '1.0.8.zip', fileURLfolder = fileURL;
	        			var zipPath = cordova.file.applicationDirectory+"www/",
	        				zipPathUrl = zipPath+'1.0.8.zip'
	        			zip.unzip(fileURLzip, fileURLfolder, function(res){
	        		          zip.unzip(fileURL+'/1.0.8/assets.zip', fileURLfolder+'/allspark', function(res){
	        				   console.log("download complete-1");
	        				   zip.unzip(fileURL+'/1.0.8/css.zip', fileURLfolder+'/allspark', function(res){
	        					console.log("download complete-2");
	        					zip.unzip(fileURL+'/1.0.8/js.zip', fileURLfolder+'/allspark', function(res){
	        						console.log("download complete-3");
	        						zip.unzip(fileURL+'/1.0.8/json.zip', fileURLfolder+'/allspark', function(res){
	        							console.log("download complete-4");
	        							zip.unzip(fileURL+'/1.0.8/lib.zip', fileURLfolder+'/allspark', function(res){
	        								zip.unzip(fileURLfolder+'/allspark/lib/fonts.zip', fileURLfolder+'/allspark/lib', function(res){
	        									console.log("download complete-5");
	        									zip.unzip(fileURLfolder+'/allspark/lib/jquery.zip', fileURLfolder+'/allspark/lib', function(res){
	        										console.log("download complete-6");
	        										zip.unzip(fileURLfolder+'/allspark/lib/require.zip', fileURLfolder+'/allspark/lib', function(res){
	        											console.log("download complete-7");
	        											zip.unzip(fileURLfolder+'/allspark/lib/tinymce.zip', fileURLfolder+'/allspark/lib', function(res){
	        												console.log("download complete-8");
	        												//** PLEASE COPY THIS TO IOS***//*
	        											//	document.getElementById("loadingOverlay").classList.add("hide");
	        												window.localStorage.setItem('allspark',true);
	        												window.readerAppHelper.cleanZipfile("1.0.8");
	        												window.readerAppHelper.ClearDirectory("1.0.8");
	        												window.localStorage.removeItem("simUpdateData");
	        												//window.readerAppHelper.ClearDirectory("allspark")
	        												if(!window.popupactive){
	        												window.readerAppHelper.checkLogin();
	        												}
	        												//** PLEASE COPY THIS TO IOS***//*
	        												//document.getElementsByClassName("tile-download")[0].classList.add("hide");
	        											});
	        										});
	        									});
	        								});
	        							});
	        						});
	        					});
	        				});
	        			});
	        			//window.localStorage.setItem('allspark','true');
	        			});

	                },
	                function(error){
	                	console.log(error)
	                   alert(error);
	                }
	        );

/*	var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
    var basePath = cordova.file.applicationDirectory+"www/1.0.8.zip";

    window.resolveLocalFileSystemURL(encodeURI(basePath), function(fileEntry){
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fileSystem) {
                var copyToPath = fileURL,
                parentEntry = new DirectoryEntry(copyToPath);
                fileEntry.copyTo(parentEntry,'1.0.8.zip', function(){
                    console.log("file copy success");
                    },fileCopyFail);
            },fileCopyFail);
    },fileCopyFail);


function fileCopyFail(error) {
    alert(error);
}*/


//var path = path.toString();

	/***THODA KAAM KA ***/
/*   window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
   function fail(evt) {
       alert("FILE SYSTEM FAILURE:",evt);
   }
   function onFileSystemSuccess(fileSystem) {
	   console.log(fileSystem.root.fullPath);
	   var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;
	    var basePath = cordova.file.applicationDirectory+"www/1.0.8.zip";
	   fileSystem.root.getFile("/1.0.8.zip",
			   {create:true,exclusive:true},
			   function(entry){
				   console.log("aa gaya");
				    var copyToPath = fileURL,
	                parentEntry = new DirectoryEntry(copyToPath);
				   entry.copyTo(parentEntry,'1.0.8.zip',function(success){
					   console.log("file copy success"+success);
				   },function(err){
					   console.log(err)
				   })
				   },
			   function(err){
					   console.log(err)

				   });
   }*/

},
ClearDirectory:function (path) {
	 var path = path.toString();
	 /*vipin*/ window.localStorage.removeItem(path)
       window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
       function fail(evt) {
           alert("FILE SYSTEM FAILURE");
       }
       function onFileSystemSuccess(fileSystem) {
           fileSystem.root.getDirectory(
        		   "../../Library/NoCloud/"+ path,
               {create : true, exclusive : false},
               function(entry) {
               entry.removeRecursively(function() {
                   console.log("Remove Recursively Succeeded");
               }, fail);
           }, fail);
       }
   },
   cleanZipfile:function (path){
	 var path = path.toString();
       window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
       function fail(evt) {
           alert("FILE SYSTEM FAILURE");
       }
       function onFileSystemSuccess(fileSystem) {
           fileSystem.root.getFile(
        		   "../../Library/NoCloud/"+path+".zip",
               {create : true, exclusive : false},
               function(entry) {
               entry.remove(function() {
               	window.localStorage.removeItem(path)


               	console.log("Vipin Bhai Chaa Gaye")
               }, fail);
           }, fail);
       }
   },
runInstallScripts:function(onSuccessCallBack){
    'use strict';
    var appDir = null;
    var update_info = {'current' : 0, past:[]};
    console.log('Running install scripts');

    function finishedRunningInstallScripts(){
        if(appDir){
            appDir.getFile('install_state.nfo', {create : true}, function(f){
                           f.createWriter(function(fw){
                                          fw.onwrite = function(evt) {
                                          console.log(evt);
                                          if(onSuccessCallBack){
                                          onSuccessCallBack();
                                          }
                                          };
                                          fw.seek(0);
                                          console.log('writing new update info json');
                                          fw.write(JSON.stringify(update_info));
                                          }, onError);
                           }, onError);
        }
        else if (onSuccessCallBack){
            onSuccessCallBack();
        }
    }

    function onError(e) {
        var msg = '';
        console.log('Error: ' + msg);
        console.log(e);
        try{
            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'QUOTA_EXCEEDED_ERR';
                    break;
                case FileError.NOT_FOUND_ERR:
                    msg = 'NOT_FOUND_ERR';
                    break;
                case FileError.SECURITY_ERR:
                    msg = 'SECURITY_ERR';
                    break;
                case FileError.INVALID_MODIFICATION_ERR:
                    msg = 'INVALID_MODIFICATION_ERR';
                    break;
                case FileError.INVALID_STATE_ERR:
                    msg = 'INVALID_STATE_ERR';
                    break;
                default:
                    msg = 'Unknown Error';
                    break;
            }
        }
        catch(err){
            console.log(err);
        }
        finishedRunningInstallScripts();
        //if(onSuccessCallBack) onSuccessCallBack();
    }
    /*document.addEventListener('db_cleaned',function(e){
     if (window.assessment_configs['DB_schema'] && window.sqlitePlugin && window.sqlitePlugin.openDatabase){

     //create the db from the location and store it in the specified location
     console.log("creating table from the default www location");

     var dbConn = window.sqlitePlugin.openDatabase({
     name : window.assessment_configs['DB_schema']["db_name"],
     location : 2,
     createFromLocation: 1
     });

     //update the ttl for each of the entries on update
     console.log("updating the ttl for all the entries.");

     var ttl = 2*7*24*60*60*1000; //2 weeks
     var expires = (+new Date()) + ttl;

     dbConn.transaction(
     function(tx){
     for(var i = 0; i < window.assessment_configs['DB_schema']['tables'].length; i++ ){
     tx.executeSql('UPDATE ' + window.assessment_configs['DB_schema']['tables'][i]
     + ' SET expires = ?',
     [expires] ,
     function(tx, response) StackView{
     console.log(tx);
     console.log(response);
     console.log("TTL update query successful");
     return true;
     }, function(tx, response){
     console.log(tx);
     console.log(response);
     console.log("TTL update query failed");
     return true;
     });
     }

     }
     ,function(err,tx){
     console.log("Error updating the TTL for the table");
     console.log(err);
     console.log(tx);
     onError(err);
     }
     ,function(){
     console.log('Successfully update the cache TTL');
     finishedRunningInstallScripts()
     }
     );
     } else {
     console.log("unable to create the DB");
     finishedRunningInstallScripts();
     }

     },false);

     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
     fileSystem.root.getDirectory("org.ck12.practice",{create:true},function(d){
     appDir = d;
     console.log("Got app directory reference:");
     console.log(d);
     //window.appdir = d;
     // Just could not get FileReader to work. $.ajax is a hack but it works!
     $.ajax(d.toURL()+'/install_state.nfo',{
     complete:function(j,s){
     console.log(j);

     if(j.responseText !== undefined && j.responseText != ''){
     try{
     update_info = JSON.parse(j.responseText);
     }catch(e){
     console.log('Error parsing json. Make sure the file is written with JSON.stringify');
     update_info = {"current":0,past:[]};
     }
     }
     var db_cleaned = new Event('db_cleaned');
     if(APP_VERSION && update_info.current != APP_VERSION){
     //window.assessment_configs['DB_schema'] || {};

     //change the version info
     if(update_info.current>0){
     update_info.past.push(update_info.current);
     }
     update_info.current = APP_VERSION;

     window.sqlitePlugin.deleteDatabase({
     name: window.assessment_configs['DB_schema']['db_name'],
     location:2
     }, function(){
     console.log("successfully deleted the DB");
     cordova.fireDocumentEvent("db_cleaned");
     }, function(){
     console.log("unable to delete the DB, new data might not load");
     cordova.fireDocumentEvent("db_cleaned");
     });
     }
     else if(onSuccessCallBack) onSuccessCallBack();
     },
     cache:false
     });

     },onError);
     },onError);*/

},
    /*End commenting code for app versioning */
   /*End commenting code for app versioning */
    checkLogin : function(){
                     //StatusBar.show(); // Commented code for status bar plugin


                     if(readerAppHelper.checkForServer()){
                    	 window.login_check = true;
                     $.get(window.API_SERVER_URL + '/assessment/api/get/info/my',function(data){
                         if(data.responseHeader.status !== 0){
                            /*requirejs([ 'ck12-components/dexterjs/dexterjs.min'], function (dexter) {
                                     if(window.dexter){
                                         reader.dexterjs = window.dexterjs;
                                     }
                                     readerAppHelper.logScreenViewEventForApp('Welcome');
                                     window.location.href = "auth/login.html";
                                 });*/
                                 window.location.href = "auth/login.html";
                         }else{
                             if(typeof(Storage) != undefined) {
                                 readerAppHelper.setUserInfo(data.response.member);
                             }

	                         window.location.href = "www/index.html";
                         }
                     }, "json");
                     }
                     else{
                         if(this.getUserInfo() && this.getUserInfo().uID){
                        	 window.login_check = true;
                        	 console.log(this.getUserInfo().uID);
                        	/* console.log(this.getUserInfo().uID);*/
							 window.location.href = "www/index.html";
                         }
                         else{
                             this.checkForNetwork();
                         }
                     }
    },
    resultValidation : function (result) {
        if (result.hasOwnProperty('response')) {
            result = result.response;
            if (result.hasOwnProperty('message')) {
                result = '';
            }
        } else {
            result = '';
        }
        return result;
    },
    checkForPasswordChange : function(result){
        try {
            if (JSON.parse(result).response) {
                result = JSON.parse(result).response;
                if (result.message) {
                    if (result.message.match('Incorrect password')) {
                        alert('The Password you have entered in the Current Password field is incorrect. Please check it again to make sure it is spelled correctly.');
                    } else if (result.message.match('missing password')) {
                        alert('You did not enter a password. Please enter your password and try again.');
                    } else {
                        alert(result.message);
                    }
                    result = '';
                }
            } else {
                result = '';
                alert('Sorry, we could not update the user info right now. Please try again later or contact our customer support.');
            }
            return result;
        } catch (e) {
            console.log(e);
            return '';
        }
    },

    loginSuccess:function(gdata, authWindow){
        var that=this;
                      // Binding the click event on gplay login button again.
                     readerAppHelper.bindGPlayClickEvent();
                     if(gdata) {
                         $.get(window.API_SERVER_URL + '/assessment/api/get/info/my',function(data){
                             if(data.responseHeader.status === 0){
                                 if(data.response.member){
                                     welcomeName = data.response.member.firstName +" "+data.response.member.lastName || data.response.member.email ||data.response.member.login;

                                     if(typeof(Storage) != undefined) {localStorage.setItem('user',(welcomeName));
                                     readerAppHelper.setUserInfo(data.response.member);}

                                     /*Commented code for event logging*/

                                     if(authWindow) {
                                         authWindow.close();
                                     }
                                     $(".landing-page").addClass('hide');
                                     $(".app-container").removeClass('hide');
                                     window.location.href = "../www/index.html";
                                   /*  if(data.response.member.roles[0] === "member"){
                                         that.thankYouSignUp(welcomeName);
                                     }*/
                                     /* if(data.response.member.roles[0] === "teacher"||data.response.member.roles[0] === "student"){
                                         window.location.href = "www/index.html";
                                     }*/
                                 }
                             }else{
                                 console.log('Error getting user info');
                                 console.log(data.response.message);
                                 if(authWindow) {
                                     authWindow.close();
                                 }
                                 $('#message').html("There was an error problem signing you in. Please try again or try later.");
                             }
                         }, "json");
                     }
                 },

    bindGPlayClickEvent:function(){
                            $(".message-googleplaySignin").removeClass("hide").html("");
                            $(".message-googleplaySignup").removeClass("hide").html("");
                            $('.signin-googleplay').off('click').on('click', function(e){
                                $('.signin-googleplay').off('click');
                                mode = $(this).data("mode");
                                if(mode === 'signin'){
                                     $(".message-googleplaySignin").removeClass("hide").html("signing in ...");
                                }
                                else if(mode === 'signup'){
                                     $(".message-googleplaySignup").removeClass("hide").html("signing up ...");
                                }
                                readerAppHelper.googlePlayLogin();
                            });
                        },
    loginError:function(error, authWindow){
                   if(authWindow) {
                       authWindow.close();
                   }
                   // Binding the click event on gplay login button again.
                   readerAppHelper.bindGPlayClickEvent();
                   // ErrorCode:1001 - User did not approve oAuth permissions request.
                   // ErrorCode:1002 - User declined to provide an account.
                   if(error !== '1001' && error !== '1002') {
                       $('#message').html("There was a problem signing you in. Please try again or try later.");
                   }
               },
    googleLogin:function(){

                    if(readerAppHelper.checkForServer()) {

                    var authUrl = window.API_SERVER_URL + '/auth/login/member/google?url=' + escape(window.API_SERVER_URL + '/auth/verify/member/google');

                    var authWindow = window.open(authUrl, '_blank', 'location=no');



                    $(authWindow).on('loadstart', function(e) {
                        var url = e.originalEvent.url;
                        e.preventDefault();
                        var code = /ck12.org\/auth\/verify\/member\/google\?code=(.+)$/.exec(url);
                        var error = /\?error=(.+)$/.exec(url);

                        if(code){
                            $('#message').html("signed in ...");
                            $.get(url, function(gdata){
                                readerAppHelper.loginSuccess(gdata, authWindow);
                            });
                        }else if(error){
                            readerAppHelper.loginError(error, authWindow);
                        }
                    });
                  }else{
                    readerAppHelper.checkForNetwork();
                      console.debug("Network error, Aborting the login");
                      return;
                  }
                },

    googlePlayLogin:function(){
                        if(readerAppHelper.checkForServer()) {

                        /*Commented code for google accounts*/
                        if(window._platform == 'android' && !window._device_model.match(/chrome/gi)) {
                            var cback = {};
                            cback = function (accounts) {
                                var timer = null;
                                if(accounts.length > 0) {
                                    var callback = {};
                                    callback.success = function (exchangeCode) {
                                        clearInterval(timer);
                                        loginurl = window.API_SERVER_URL+ '/auth/login/member/google?url=&appLogin=True'
                                            console.debug(loginurl);
                                        $.get(loginurl, function(response){
                                            url = window.API_SERVER_URL + '/auth/verify/member/google';
                                            console.debug(url);
                                            $.get(url, { 'token': exchangeCode }, function(gdata){
                                                readerAppHelper.loginSuccess(gdata);
                                            });
                                        });
                                    }
                                    callback.error = function (msg, callback) {
                                        clearInterval(timer);
                                        console.debug("There was error accessing user data by using google play login");
                                        console.debug(msg);
                                        readerAppHelper.loginError(msg);
                                    }
                                    window.identity.getAuthToken({ 'interactive': true }, callback);

                                    //Bug 33696 - A Workaround to keep the webview and plugin in active state while the google play login is on progress.
                                    timer = window.setInterval(function () {
                                        window.identity.getAccounts({}, function(){});
                                    }, 2000);
                                } else {
                                    // Fallback to google service login if there is no account exist.
                                    readerAppHelper.googleLogin();
                                    // Binding the click event on gplay login button again.
                                    readerAppHelper.bindGPlayClickEvent();

                                }
                            }
                            window.identity.getAccounts({}, cback);

                        } else {
                            // Fallback to google service login if the device is not compatible for google play auth service.
                            readerAppHelper.googleLogin();
                            // Binding the click event on gplay login button again.
                            readerAppHelper.bindGPlayClickEvent();
                        }
                      }else{
                        readerAppHelper.checkForNetwork();
                          console.debug("Network error, Aborting the login");
                          return;

                      }
                    },

    userLogin:function(usr,pass,successCallBack){
                  readerAppHelper.setStatus('signing in ...');
                  readerAppHelper.logout(function(data){
                      readerAppHelper.login(usr, pass, successCallBack)
                  });
              },

    login : function(usr, pass, successCallBack){
        var that=this;
                $.ajax({
                    type: 'POST',
                url: window.API_SERVER_URL+"/auth/login/member",
                data: {login:usr, token:pass, authType:'ck-12', remember:'true'},
                dataType : 'json',
                success: function(data){
                    if(typeof(Storage) != undefined) {
                        readerAppHelper.setUserInfo(data.response);
                    }
                    successCallBack(data);
                }
            });
       },

    signUp : function(data){
        var that=this;
     /*   $(".landing-page").addClass('hide');
        $(".app-container").removeClass('hide')*/;
        var x=data.givenName;
       //that.thankYouSignUp(x);
        if(readerAppHelper.checkForServer()){
        return $.ajax({
                 "type" : "POST",
                 "url" : window.API_SERVER_URL + "/auth/create/member",
                 "data" : data,
                 //"async" : false, //commenting async as it is stopping the js flow
                 "dataType" : "json",
                 "success" : function(response){
                     if(response.responseHeader.status === 0){
                         window.readerAppHelper.login(data.email, data.token, function(){
                             $(".landing-page").addClass('hide');
                             $(".app-container").removeClass('hide');
                             that.thankYouSignUp(x);
                             that.getUserInfoOkayPage({
                                    "success" : function(data){
                                        console.log(data);
                                        readerAppHelper.setUserInfo(data.response);
						    			//window.location.href = "../www/index.html";
                                    },
                                    "error" : function(error){
						    			alert("Error in sign up please try again");
						    			window.location.href = "login.html"
						    			 //that.thankYouSignUp(x);
                                    }
                            });
                         });
                     }else{
                           console.log(response.response.message);
                           $("#message-signup").removeClass("hide");
                           //$("#createUser").removeClass("disabled");
                           if((response.response.message.indexOf("http") === -1)&&(response.response.message.indexOf("HTTP") === -1)){
                               $("#message-signup").html(response.response.message);
                           }
                           else{
                               $('#message-signup').html("There was a problem signing you in. Please try again or try later.");
                           }
                     }
                 }
                 });
        }else{
        	this.checkForNetwork();
        }
             },
     thankYouSignUp:function(name){
                         var that=this;
                         requirejs(['templates/profile.builder.templates','underscore','controllers/profile.builder', 'views/profile.builder.view', 'services/ck12.locationService'],
                                 function (template,_,profileBuilder,profileBuilderView,locationService) {
                                     var thankYou_tmpl= _.template(template.THANKYOU_SIGNUP, null, {
                                         'variable': 'data'
                                     }),
                                     thankYouTmpl = thankYou_tmpl({
                                        "userName" :name
                                     });
                                     $(".app-page").empty();
                                     $(".app-page").append(thankYouTmpl);
                                     bindEvents();

                                 function redirect(){
                                     window.location.href = "../www/index.html";
                                 }
                                 function bindEvents(){
                                    $("#thankYou-okayButton").off("click.okay").on("click.okay",function(){
                                      if(window.readerAppHelper.checkForServer()){
                                        profileBuilder.load('profileBuilder', profileBuilderView, locationService,redirect);
                                      }else{
                                        window.readerAppHelper.checkForNetwork();
                                      }

                                    });
                                 }
                         });



                     },
    getUserInfoOkayPage:function(settings){
                        $.ajax({
                            "url" : window.API_SERVER_URL + "/auth/get/info/my",
                            "success" : function(response){
                                response=JSON.parse(response);
                                if(response.responseHeader.status === 0){
                                    settings && settings.success(response);
                                }
                                else{
                                    settings && settings.error(response);
                                }
                            },
                            "error" : function(response){
                                settings && settings.error(response);
                            }
                            });
                        },

    validateEmail : function(settings){
    	  if(readerAppHelper.checkForServer()){
                        $.ajax({
                            "type" : "POST",
                        "url" : window.API_SERVER_URL + "/auth/validate/member/email",
                        "data" : {
                            "email" : settings.email
                        },
                        "dataType" : "json",
                        "success" : function(response){
                            if(response){
                                settings && settings.success && settings.success(response);
                            }else{
                                settings && settings.error && settings.error(response);
                            }
                        }
                        });
    	 }else{
    		 this.checkForNetwork();
    	 }
                    },
    getSessionID : function() {
        var sessionTimeoutMins = 30;
        var sessionID = readerAppHelper.appLocalStorage.getItem("sessionID");
        var d = new Date();
        if (sessionID) {
            var parts = sessionID.split('_');
            var ts = parseInt(parts[1], 10);
            if (d.getTime() - ts > sessionTimeoutMins*60*1000) {
                sessionID = null;
            }
        }
        if (!sessionID) {
            sessionID = readerAppHelper.getRandomString(25) + "_" + d.getTime();
            readerAppHelper.appLocalStorage.setItem("sessionID", sessionID);
        }
        return sessionID.split('_')[0];
    },

    getRandomString: function(length) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    },
    logAppADSEvent: function (eventType, payload) {
                        if (!window.dexterjs) {
                            console.log("logAppADSEvent: Could not initialize dexterjs");
                            return;
                        }
                        var adsRecordAPI = window.ADS_RECORD_EVENT_API;
                        var adsRecordBulkAPI = window.ADS_RECORD_BULK_API;
                        var userInfo = readerAppHelper.getUserInfo();
                        var userID = userInfo.uID || "2";
                        dexterjs.set("config", {
                            clientID: window.FBS_CLIENT_ID,
                            memberID: userID,
                            trackPageTime: false ,
                            apis: {
                                recordEvent: (window.ADS_SERVER_API),
                                recordEventBulk: (window.ADS_SERVER_API+"/bulk"),
                                recordEventBulkZip: (window.ADS_SERVER_API+"/bulk/zip")
                            }
                        });
                        payload = payload || {};
                        if (window.device) {
                            payload.app_platform = window.device.platform;
                            payload.device = device.model;
                            console.log("device.model: " + device.model);
                        } else {
                            console.log("logAppADSEvent: Cannot get device information");
                        }
                        payload.app_version = "1.0";
                        payload.app_name = "Simulations";
                        payload.memberID = userID;
                        payload.sessionID = readerAppHelper.getSessionID();
                        console.log("Logging ADS event: " + eventType + ", payload: " + JSON.stringify(payload));
                        window.dexterjs.logEvent(eventType, payload);
                        if(window.analytics){
                        	window.analytics.trackEvent(JSON.stringify(payload), eventType)
                        	console.log("Google Events")
                        }
    },
	 addADSEvents : function(name,options){
		this.logAppADSEvent(name,options);
	},
    logScreenViewEventForApp : function(pageName, props) {
                                    try {
                                        if (window.analytics) {
                                            if (window.analytics) {
                                              var trackerID =  window.reader_configs['APP_GA_TRACKER']['ios'+'_tracker'];
                                            console.log("[reader.js:logScreenViewEventForApp] pageName: " + pageName + ", id: " + trackerID );
                                            window.analytics.startTrackerWithId(trackerID);
                                            window.analytics.trackView(pageName);
                                            console.log("Google Events")
                                            }
                                        } else {
                                            console.log("Cannot initialize window.analytics");
                                        }
                                        if (window.dexterjs) {
                                            var payload = {};
                                            payload.screeen_name = pageName;
                                            payload.sessionID = readerAppHelper.getSessionID();
                                            this.addADSEvents("APP_SCREEN_VIEW", payload);
                                        } else {
                                            console.log("Cannot initialize window.dexterjs");
                                        }
                                    } catch (e) {}
    },
    getGaSetUserId : function(){
    	  if (window.analytics) {
    		  var userInfo = readerAppHelper.getUserInfo();
              var userID = userInfo.uID || "2";
    		  window.analytics.setUserId(userID);
    		  console.log("Google yracking userID : "+userID)
    	  }else{
    		  console.log("unable to track userId")
    	  }
    },


    /*Code commented as no DOB validation*/
    /** code to put in ios**/
    logout:function(successCallBack){
        'use strict';
        if(readerAppHelper.checkForServer()){
        window.cookies.clear(function(data){
            if(successCallBack){
                console.log('No local cache found.');
                readerAppHelper.clearUserInfo();
                localStorage.removeItem("user");
                successCallBack(data);
            }
            else {
                window.location.href = 'index.html';
                window.readerAppHelper.logScreenViewEventForApp('Welcome');
            }
        }, function(){
            console.log('clearing cookies failed');
            $.get(window.API_SERVER_URL+'/auth/signout', function(data){
                window.identity.removeCachedAuthToken({});
                readerAppHelper.clearUserInfo();
                localStorage.removeItem("user");
                if(successCallBack){
                    console.log('No local cache found.');
                    successCallBack(data);
                }
                else {
                    window.location.href = 'index.html';
                    window.readerAppHelper.logScreenViewEventForApp('Welcome');
                }
            });
        });
        }else{
        	this.checkForNetwork();
        }
    },


/*    logout:function(successCallBack){

    		if(navigator.onLine){
    			   $.get(window.API_SERVER_URL+'/auth/signout', function(data){
    	                   window.identity.removeCachedAuthToken({});
    	                   readerAppHelper.clearUserInfo();
    	                   localStorage.removeItem("user");
    	                   commented code for smart caching
    	                   try{
    	                       if (window.SmartCache){
    	                           window.smartcache_instance = window.smartcache_instance || new window.SmartCache();
    	                           window.smartcache_instance.clear_namespace('user',{
    	                               "cachesuccess":function(){
    	                                   console.log("Cleared user cache!")
    	                               if(successCallBack){successCallBack(data);}
    	                               else window.location.href = '../reader-index.html';
    	                               },
    	                               "cachefailure":function(){
    	                                   console.log("Failed to clear user cache!")
    	                               if(successCallBack){successCallBack(data);}
    	                               else window.location.href = '../reader-index.html';
    	                               }
    	                           });
    	                       }
    	                       else{
    	                           if(successCallBack){
    	                               console.log("No local cache found.")
    	                                   successCallBack(data);
    	                           }
    	                           else {
    	                               window.location.href = 'index.html';
    	                               readerAppHelper.logScreenViewEventForApp('Welcome');
    	                           }
    	                   }
    	                   }
    	                   catch(e){
    	                       if(successCallBack){
    	                           console.log("Failed to clear user cache!")
    	                               successCallBack(data);
    	                       }
    	                       else window.location.href = '../reader-index.html';
    	                   }


    	               });
    		}else{
    			this.checkForNetwork();
    		}

           },*/

    setStatus:function(statusStr){
                  statusStr = statusStr + '<br><br>';
                  try{$('#status').prepend(statusStr);}
                  catch(err){}
                  console.log(statusStr);
              },
     /*Commented code specific to practice app */
      initHeader:function(data){
          var isTouchDevice = 'ontouchstart' in document.documentElement;


          if(isTouchDevice){
                   if(typeof data.backButtonHandler === "function" && $("#backButton").length > 0){
                       $("#backButton").off("touchend.back").on("touchend.back", data.backButtonHandler);
                   }

                   $('#networkErrorModalOverlay').off("touchend").on("touchend", function (e){
                  removeNetworkOverlay();
              });
          }
          else{
            if(typeof data.backButtonHandler === "function" && $("#backButton").length > 0){
                  $("#backButton").off("click.back").on("click.back", data.backButtonHandler);
              }

              $('#networkErrorModalOverlay').off("click").on("click", function (e){
                  removeNetworkOverlay();
              });
          }


          function removeNetworkOverlay(){
                       $("body.practice-app-view").removeClass("slide-left");
                       $("#networkErrorModalOverlay").css("opacity", 0);

                       setTimeout(function() {
                           $("#userInfoMenu").addClass("hide");
                           $("#networkErrorModalOverlay").addClass("hide");
                       }, 200);
          }

      },
    appLocalStorage : {
                          "getItem" : function(key){
                              var config  = null;
                              if(!window.localStorage){
                                  return false;
                              }

                              config = JSON.parse(window.localStorage.getItem("reader_app_config"));

                              if(config && config[key]){
                                  return config[key];
                              }else{
                                  return false;
                              }
                          },

                          "setItem" : function(key, value){
                              var config  = null;
                              if(!window.localStorage){
                                  return false;
                              }

                              config = JSON.parse(window.localStorage.getItem("reader_app_config"));

                              if(!config){
                                  config = {};
                              }

                              config[key] = value;

                              config = JSON.stringify(config);
                              window.localStorage.setItem("reader_app_config", config);

                              return true;
                          }
                      },

    setUserInfo : function(member){
                      var userName = (member.firstName + " " + member.lastName) || "",
                      userImage = member.imageURL || "",
                      uID = member.uID || member.id || "",
                      email = member.email || "",
                      login = (member.login === member.defaultLogin) ? "" : member.login;

                      if(userImage){
                          if(userImage.indexOf("flx")!==-1){
                              userImage = window.API_SERVER_URL + userImage;
                          }
                          else{
                              userImage = userImage;
                          }
                        }

                      this.appLocalStorage.setItem("userName", userName);
                      this.appLocalStorage.setItem("userImage", userImage);
                      this.appLocalStorage.setItem("uID", uID);
                      this.appLocalStorage.setItem("email", email);
                      this.appLocalStorage.setItem("login", login);
                      this.appLocalStorage.setItem("launcher-app", true);
                  },

    clearUserInfo : function(){
                        this.appLocalStorage.setItem("userName", "");
                        this.appLocalStorage.setItem("userImage", "");
                        this.appLocalStorage.setItem("uID", "");
                        this.appLocalStorage.setItem("email", "");
                        this.appLocalStorage.setItem("login", "");
                        this.appLocalStorage.setItem("subject", "");
                        this.appLocalStorage.setItem("branch", "");
                        this.appLocalStorage.setItem("practiceHandle", "");
                        this.appLocalStorage.setItem("launcher-app", true);
                    },

    getUserInfo : function(){
                      return {
                          "userName" : this.appLocalStorage.getItem("userName"),
                          "userImage" : this.appLocalStorage.getItem("userImage"),
                          "uID" : this.appLocalStorage.getItem("uID"),
                          "email" : this.appLocalStorage.getItem("email"),
                          "login" : this.appLocalStorage.getItem("login"),
                          "launcher-app":this.appLocalStorage.getItem("launcher-app"),
                      };
                  },

    checkForNetwork : function(){
      var networkState = null,
       networkModal = null;
      //  if (navigator.connection){
        //networkState = navigator.connection.type;
        //if(Connection.NONE === networkState){
            //if($("#networkErrorModal").length > 0){
              //  $("#networkErrorModal,#networkErrorModalOverlay").removeClass("hide");
            //}else{
                networkModal = window.readerAppHelper.getNetworkErrorModal();
                $("body").append(networkModal);
                $("#networkErrorModal").off("click").on("click", ".closeNetworkModal", function(){
                    // $("#networkErrorModal,#networkErrorModalOverlay").addClass("hide");

                    var networkState = navigator.connection.type;
                    if (!readerAppHelper.checkForServer()) {
                        // do nothing
                    } else {
                      if(window.location.pathname.split( '/' ).pop()==="login.html" && !($(".app-container").hasClass("hide"))){
                        $("#networkErrorModal,#networkErrorModalOverlay").addClass("hide")
                      }else{
                        window.location.reload(false);
                      }

                    }
                });
          //  }
            return false;
        //}
        return true;
        //}
        return navigator.onLine;

    },
    checkForServer : function(){

        var xhr = new XMLHttpRequest();
		var file = window.API_SERVER_URL +'/assessment/api/app/versions?appName=ck12sims';
        var r = Math.round(Math.random() * 10000);
        xhr.open('HEAD', file + "?subins=" + r, false);
        try {
            xhr.send();
            if (xhr.status >= 200 && xhr.status < 304) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }

    },
   /* 'showModalPopup' : function(title, body, action, action_label, dismiss_label, msg_type){
        'use strict';
        var popUpModal = null;
        if($('#networkErrorModalOverlay').length <= 0) {
            $('body').append('<div id="networkErrorModalOverlay" class="reveal-bg"></div>');
        }
        if($('#messagePopupModal').length > 0){
            $('#messagePopupModal').remove();
        }

        popUpModal = window.readerAppHelper.getModalPopupHTML(title, body, action, action_label, dismiss_label);
        $('body').append(popUpModal);

        if($('#popup_modal_act')){
            if (action && action.indexOf('http') !== 0) {
                action = cordova.file.applicationDirectory + action;
            }
            $('#popup_modal_act').off('click').on('click', (function(url){
                                                            return function(){
                                                            window.readerAppHelper.runInstallScripts(function(){
                                                                                                     if (url.indexOf('http') === 0) {
                                                                                                     window.open(url, '_system', 'location=yes');
                                                                                                     }
                                                                                                     else {
                                                                                                     if(msg_type === 'SC') {
                                                                                                     window.readerAppHelper.appLocalStorage.setItem('scOff', false);
                                                                                                     window.readerAppHelper.appLocalStorage.setItem('summerChallengePrompted', '');
                                                                                                     }
                                                                                                     window.location.href = url;
                                                                                                     }
                                                                                                     });
                                                            };
                                                            })(action));
        }
        if($('#popup_modal_dismiss')){
            $('#popup_modal_dismiss').off('click').on('click', function(){
                                                      $('#messagePopupModal, #networkErrorModalOverlay').addClass('hide');
                                                      if(!msg_type) {
                                                      //window.readerAppHelper.runInstallScripts(window.readerAppHelper.checkLogin);
                                                    if(window.login_check==false){
                                                    	window.popupactive =false;
                                                    	   window.readerAppHelper.zipUnzipAllspark()
                                                    }

                                                      }
                                                      });
        }
    },*/
    'getModalPopupHTML':function(title, body, action, action_label, dismiss_label){
        'use strict';
        var popupmodal = '<div class="no-network" id = "messagePopupModal">' +
        '<div class="icon-container"><i class="icon-notice"></i></div>' +
        '<div class="message-title">' + title + '</div>' +
        '<div class="message-body">' + body + '</div>' +
        '<div>';
        if(action && action_label){
            popupmodal += '<input type = "button" id = "popup_modal_act" class="button tangerine small" value = "' + action_label + '"><br>';
        }
        if(!dismiss_label){
            dismiss_label = 'OK, got it';
        }
        popupmodal += '<input type="button" id="popup_modal_dismiss" class="button tangerine small" value="' + dismiss_label + '">';

        popupmodal += '</div></div></div>';
        return popupmodal;
    },

    'getNetworkErrorModal' : function(){
        var tmpl = [];

        tmpl.push('<div class="no-network" id="networkErrorModal">');
        tmpl.push('<span class="icon-network icon-sym"></span>');
        tmpl.push('<div class="message-body">Activities aren\'t available right now!</div>');
        tmpl.push('<p>Either you don\'t have a network <br/>connection or our server is acting up.</p>');
        tmpl.push('<div><input type="button" class="button dusty-grey dismiss-req closeNetworkModal " value="Retry"></div></div>');
        tmpl.push('</div>');

        $('body').append('<div id="networkErrorModalOverlay" class="reveal-bg"></div>');
        return tmpl.join("");
    },
    downloadAllspark:function(){
    	if(!window.localStorage.getItem("allspark")){
    		document.getElementById("loadingOverlay").classList.remove("hide");
    		var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, refUrl = "http://simdev.ck12.org"+"/simulations/common/allspark/1.0.8.zip", uri = encodeURI(refUrl),
    				fileURLzip = fileURL + '1.0.8.zip', fileURLfolder = fileURL;

    				var fileTransfer = new FileTransfer();
    				fileTransfer.download(uri,fileURLzip,function(entry) {
    						console.log("download complete: " + entry.toURL());
    						zip.unzip(fileURLzip, fileURLfolder, function(res){
    							zip.unzip(fileURL+'/1.0.8/assets.zip', fileURLfolder+'/allspark', function(res){
    								console.log("download complete-1");
    								zip.unzip(fileURL+'/1.0.8/css.zip', fileURLfolder+'/allspark', function(res){
    									console.log("download complete-2");
    									zip.unzip(fileURL+'/1.0.8/js.zip', fileURLfolder+'/allspark', function(res){
    										console.log("download complete-3");
    										zip.unzip(fileURL+'/1.0.8/json.zip', fileURLfolder+'/allspark', function(res){
    											console.log("download complete-4");
    											zip.unzip(fileURL+'/1.0.8/lib.zip', fileURLfolder+'/allspark', function(res){
    												zip.unzip(fileURLfolder+'/allspark/lib/fonts.zip', fileURLfolder+'/allspark/lib', function(res){
    													console.log("download complete-5");
    													zip.unzip(fileURLfolder+'/allspark/lib/jquery.zip', fileURLfolder+'/allspark/lib', function(res){
    														console.log("download complete-6");
    														zip.unzip(fileURLfolder+'/allspark/lib/require.zip', fileURLfolder+'/allspark/lib', function(res){
    															console.log("download complete-7");
    															zip.unzip(fileURLfolder+'/allspark/lib/tinymce.zip', fileURLfolder+'/allspark/lib', function(res){
    																console.log("download complete-8");
    																/** PLEASE COPY THIS TO IOS***/
    																//document.getElementById("loadingOverlay").classList.add("hide");
    																window.localStorage.setItem('allspark',true);
    																window.readerAppHelper.ClearDirectory("1.0.8");
    																window.readerAppHelper.cleanZipfile("1.0.8")
    																window.readerAppHelper.checkLogin();
    																document.getElementById("loadingOverlay").classList.add("hide");
    																/** PLEASE COPY THIS TO IOS***/
    																//document.getElementsByClassName("tile-download")[0].classList.add("hide");
    															});
    														});
    													});
    												});
    											});
    										});
    									});
    								});
    							});
    							//window.localStorage.setItem('allspark','true');
    						});

    					},
    					function(error) {
    						console.log("download error source " + error.source);
    						console.log("download error target " + error.target);
    						console.log("upload error code" + error.code);
    					},
    					false,
    					{
    						headers: {
    							"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
    						}
    					}
    				);
    			}else{
    				window.readerAppHelper.checkLogin();
    			}
    },
    ClearDirectory:function (path) {
		 var path = path.toString();
		 /*vipin*/ window.localStorage.removeItem(path)
	        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
	        function fail(evt) {
	            alert("FILE SYSTEM FAILURE");
	        }
	        function onFileSystemSuccess(fileSystem) {
	            fileSystem.root.getDirectory(
	            		"../../Library/NoCloud/"+ path,
	                {create : true, exclusive : false},
	                function(entry) {
	                entry.removeRecursively(function() {
	                    console.log("Remove Recursively Succeeded");
	                }, fail);
	            }, fail);
	        }
	    },
	    cleanZipfile:function (path){
			 var path = path.toString();
		        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
		        function fail(evt) {
		            alert("FILE SYSTEM FAILURE");
		        }
		        function onFileSystemSuccess(fileSystem) {
		            fileSystem.root.getFile(
		            		"../../Library/NoCloud/"+path+".zip",
		                {create : true, exclusive : false},
		                function(entry) {
		                entry.remove(function() {
		                	window.localStorage.removeItem(path)


		                	console.log("Vipin Bhai Chaa Gaye")
		                }, fail);
		            }, fail);
		        }
		    },
showUpdateAvailable: function(force){
    'use strict';
    var versionModal = null;
    if($('#versionErrorModal').length > 0){
        $('#versionErrorModal, #networkErrorModalOverlay').removeClass('hide');
    }else{
        versionModal = window.readerAppHelper.getVersionErrorModal(force);
        $('body').append(versionModal);
        $('#versionErrorModal .update').off('click').on('click', function(){
                                                        //$("#networkErrorModal,#networkErrorModalOverlay").addClass("hide");
        	window.readerAppHelper.ClearDirectory("allspark");
        	window.localStorage.removeItem("allspark");
        	window.localStorage.removeItem("simUpdateData");
                                                        window.open(encodeURI(APP_DOWNLOAD_URL[window._platform]), '_system');
                                                        navigator.app.exitApp();
                                                        });
        if(!force){
            $('#versionErrorModal .dismissUpdate').off('click').on('click', function(){
                                                                   $('#versionErrorModal,#networkErrorModalOverlay').addClass('hide');
                                                                   if(window.login_check==false){window.readerAppHelper.zipUnzipAllspark()}
                                                                   //window.readerAppHelper.zipUnzipAllspark();

                                                                   });
        }
    }

},
    'showModalPopup' : function(title, body, action, action_label, dismiss_label, msg_type){
        'use strict';
        var popUpModal = null;
        if($('#networkErrorModalOverlay').length <= 0) {
            $('body').append('<div id="networkErrorModalOverlay" class="reveal-bg"></div>');
        }
        if($('#messagePopupModal').length > 0){
            $('#messagePopupModal').remove();
        }

        popUpModal = window.readerAppHelper.getModalPopupHTML(title, body, action, action_label, dismiss_label);
        $('body').append(popUpModal);

        if($('#popup_modal_act')){
            if (action && action.indexOf('http') !== 0) {
                action = cordova.file.applicationDirectory + action;
            }
            $('#popup_modal_act').off('click').on('click', (function(url){
                                                            return function(){
                                                            window.readerAppHelper.runInstallScripts(function(){
                                                                                                     if (url.indexOf('http') === 0) {
                                                                                                     window.open(url, '_system', 'location=yes');
                                                                                                     }
                                                                                                     else {
                                                                                                     if(msg_type === 'SC') {
                                                                                                     window.readerAppHelper.appLocalStorage.setItem('scOff', false);
                                                                                                     window.readerAppHelper.appLocalStorage.setItem('summerChallengePrompted', '');
                                                                                                     }
                                                                                                     window.location.href = url;
                                                                                                     }
                                                                                                     });
                                                            };
                                                            })(action));
        }
        if($('#popup_modal_dismiss')){
            $('#popup_modal_dismiss').off('click').on('click', function(){
                                                      $('#messagePopupModal, #networkErrorModalOverlay').addClass('hide');
                                                      setTimeout(function() {
                                                    	  if(window.login_check==false) {
                                                              //window.readerAppHelper.runInstallScripts(window.readerAppHelper.checkLogin);
                                                    		  window.popupactive =false;
                                                              window.readerAppHelper.zipUnzipAllspark();
                                                              }
                                                      },1500)

                                                      });
        }
    },
    'getModalPopupHTML':function(title, body, action, action_label, dismiss_label){
        'use strict';
        var popupmodal = '<div class="no-network" id = "messagePopupModal">' +
        '<div class="icon-container"><i class="icon-notice"></i></div>' +
        '<div class="message-title">' + title + '</div>' +
        '<div class="message-body">' + body + '</div>' +
        '<div>';
        if(action && action_label){
            popupmodal += '<input type = "button" id = "popup_modal_act" class="button tangerine small" value = "' + action_label + '"><br>';
        }
        if(!dismiss_label){
            dismiss_label = 'OK, got it';
        }
        popupmodal += '<input type="button" id="popup_modal_dismiss" class="button tangerine small" value="' + dismiss_label + '">';

        popupmodal += '</div></div></div>';
        return popupmodal;
    },
    getVersionErrorModal : function(force){
        'use strict';
        var tmpl = [];

        tmpl.push('<div class="no-network" id="versionErrorModal">');
        if(force){
            tmpl.push('<div class="message-body">Please update</div>');
            tmpl.push('<p>Looks like you\'re using a version of the app that is no longer supported!</p>');
            tmpl.push('<div><input type="button" class="button dusty-grey update" value="Update"></div></div>');
        }else{
            tmpl.push('<div class="message-body">Update available</div>');
            tmpl.push('<p>A new version of CK-12 is available!</p>');
            tmpl.push('<div><input type="button" class="button dusty-grey update" value="Update"><input type="button" class="button dusty-grey dismissUpdate" value="Not now"></div></div>');

        }
        $('body').append('<div id="networkErrorModalOverlay" class="reveal-bg"></div>');
        return tmpl.join('');
    },

    "initAjaxSetup" : function(){
        $.ajaxSetup({
            "error" : function(){
                readerAppHelper.checkForNetwork(); //check for network whenever there is a API call fail.
            }
        });
    },
};

//window.readerAppHelper.init();
document.addEventListener("deviceready", function(){
    setTimeout(function() {
        //readerAppHelper.registerForPushNotifications();
    },11);
},false)
