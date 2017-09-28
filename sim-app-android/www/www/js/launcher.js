define('Launcher',['ajax','SideNavigation'],function(ajax,SideNavigation){
        //require(['//dvninqhj78q4x.cloudfront.net/dexterjs/dexterjs.min.js']); // loading dexterJS
	window.console.log=function(){};
	var conceptBrowser,isConceptClosed=true;
	if(document.domain.search('ck12.org') != '-1'){
		document.domain = 'ck12.org';
	}
	
	requirejs(['../auth/js/version'],function(versionInfo){
//		console.log(versionInfo.version);
		currentAppVersion = versionInfo.major;
		console.log(currentAppVersion);
		setTimeout(function(){
			document.getElementById('versionDiv').innerHTML = 'v'+versionInfo.version;
		},500);
	});
	
    var referrer , launcherURL, launcherOnlyURL , landing_referrer , homeSourcePath , filterType, anySimDownloaded=false, downloadedMode = false, downloadedSims = [],currentAppVersion;
     launcherURL = launcherOnlyURL = window.location.href ;
    if(launcherURL.indexOf('referrer=') > -1){
    	if(launcherURL.indexOf('referrer=simulation') > -1){
    		landing_referrer = launcherURL.slice(launcherURL.indexOf('simulationName=')+15  , launcherURL.length) ;
    	}else if(launcherURL.indexOf('referrer=teacher') > -1){
    		landing_referrer = "teacher_landing" ;
    	}else if(launcherURL.indexOf('referrer=student') > -1){
    		landing_referrer = "student_landing" ;
    	}

    	 //launcherOnlyURL = launcherURL.slice(0  , launcherURL.indexOf('?referrer=')) ;
    	 launcherOnlyURL = window.location.origin+window.location.pathname;
     }
    //homeSourcePath = launcherOnlyURL.slice(0,launcherOnlyURL.indexOf('/index.html'));
    homeSourcePath = window.location.origin+window.location.pathname.split("index.html")[0];
	//Device compatibility screen
	var deviceCompatibilityAlertScreen = document.createElement('div');
    deviceCompatibilityAlertScreen.id = "deviceCompatibilityAlert";
    deviceCompatibilityAlertScreen.classList.add('device-alert');
    deviceCompatibilityAlertScreen.classList.add('hide');
    deviceCompatibilityAlertScreen.innerHTML = '<div class="device-message"></div><div class="device-error-message">Our simulations are compatible with tablets, laptops and desktops.</div>';
    document.getElementsByTagName('body')[0].appendChild(deviceCompatibilityAlertScreen);
    var minDeviceWidth = 700;
    if(((window.outerWidth>window.outerHeight)&&(window.outerWidth<minDeviceWidth))||((window.outerWidth<window.outerHeight)&&(window.outerHeight<minDeviceWidth)) || navigator.userAgent.match(/(iPhone|iPodN)/g)){
    	deviceCompatibilityAlertScreen.classList.remove('hide');
    	if(window.outerWidth>window.outerHeight){
    		document.getElementsByClassName('device-message')[0].style.marginTop = "8%";
    	}
    	deviceCompatibilityAlertScreen.ontouchmove = function(e){
			e.preventDefault();
		};
    	return;
    }
 
    
    var userInfo ,  checkForUserCredentials ;
    // window.SIM_OPN_SRV =  /gamma.ck12.org/i.test(window.API_SERVER_NAME)?"http://interactives.ck12.org":"https://simtest.ck12.org";
    // window.SIM_DWL_SRV =   /gamma.ck12.org/i.test(window.API_SERVER_NAME)?"http://interactives.ck12.org":"https://simtest.ck12.org";
    window.SIM_OPN_SRV =  /www.ck12.org/i.test(window.API_SERVER_NAME)?"http://interactives.ck12.org":"https://simtest.ck12.org";
    window.SIM_DWL_SRV =   /www.ck12.org/i.test(window.API_SERVER_NAME)?"http://interactives.ck12.org":"https://simtest.ck12.org";
	var bodyParent = document.getElementsByTagName('body')[0],coverHtml,scrollX=0, simData,simUpdateData, eidsData, stdData, thumbnailCollection, searchClick, scrollContainer, sideNav, sideNav2, conceptsArray=[], standardsArray=[], nameOfStandards=[], nameOfConcepts=[];
	
	ajax.loadURL(window.API_SERVER_URL+"/auth/get/info/my", {
        "withCredentials": true,
        "callback": checkForUserCredentials
    });

	function checkForUserCredentials(response) {
		
		if(response!==""){
			var res ;
		    userInfo = response; 
		    
		    res = JSON.parse(response);
		    window.localStorage.setItem("AuthUserInfo",response);
		    landing_referrer =   JSON.parse(localStorage.AuthUserInfo).response.role.description
	    	
		    if (res.responseHeader.status !== 0) {
		       // window.location = "https://www.ck12.org/auth/signin?returnTo="+encodeURIComponent(window.location.href);
		    }
		    else{  }
	        	 /****** DexterJs config Update ******/   
	             /*dexterjs.set("config", {
	                 clientID: 24839961 ,
	                 memberID : res.response.id ,
	                 trackPageTime: false ,
	                 apis: {
	                     recordEvent: ("http://www.ck12.org/dexter/record/event"),
	                     recordEventBulk: ("http://www.ck12.org/dexter/record/event/bulk"),
	                     recordEventBulkZip: ("http://www.ck12.org/dexter/record/event/bulk/zip")
	                 }
	             });
	            readerAppHelper.addADSEvents({
                action_name:'FBS_SIMULATION_BROWSE',
                referrer : landing_referrer 
            });
	    		dexterjs.logEvent("FBS_SIMULATION_BROWSE", {
	                referrer : landing_referrer ,
	            });
	        	/****** DexterJs config Update ******/
		 
		 
		
		}
		 
	    readerAppHelper.addADSEvents('FBS_SIMULATION_BROWSE',{
            memberID: JSON.parse(localStorage.AuthUserInfo).response.id,
            referrer : JSON.parse(localStorage.AuthUserInfo).response.role.description
        });
	   
	}
	
	var init_cover , init_simData ;
	ajax.loadURL('html/cover.html',{
		"callback" : init_cover
	});
	  function _loadUserProfile() {


	        if (!/^[\],:{}\s]*$/.test(localStorage.reader_app_config.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	        	this.info = {};
	        	this.info.userImage = false;
	            return false;
	        }
	        var info = JSON.parse(localStorage.reader_app_config);
	        this.info = info;
	        
	          
	         /*   *//****** DexterJs config Update ******//*
	            dexterjs.set("config", {
	                memberID   : this.info.id ,
	            });
	            *//****** DexterJs config Update ******/
	            
	        if (!info.email) {
	        	this.info.userImage = false;
	            return false;
	        }
	        
	        if (!info.userImage) {
	            info.userImage = 'assets/images/user_icon.png';// : 'http://interactives.ck12.org/simulations/common/allspark/1.0.5/assets/images/avatar_female.png';
	        }
	 /*       if(info.userImage.split("/")[2]=="www.ck12.org" && !(checkDeviceConnectivity())){
	        	 info.userImage = 'assets/images/user_icon.png'
	        }*/
	        if (typeof String.prototype.startsWith != 'function') {
	      	  String.prototype.startsWith = function (str){
	      	    return this.indexOf(str) === 0;
	      	  };
	      	}
	          var urlData = info.userImage;
	          var flxUrl = '/flx/show/image';
	          if(urlData.startsWith(flxUrl)){
	          	info.userImage = urlData.replace("/flx/show/image", window.API_SERVER_URL+"/flx/show/image");
	          }
//	          this.info = info;
	        this.info.userImage =  window.localStorage.getItem("User_Avtar_url") || info.userImage;
	        //toolbarOptions.userAvatar = this.info.userImage;
	        document.getElementsByClassName("user-avatar-image")[0].src = this.info.userImage;
	        document.getElementsByClassName("name")[0].innerHTML = this.info.userName;
	        document.getElementsByClassName("email")[0].innerHTML = this.info.email;
	        document.querySelector("#UserProfileView img").src = this.info.userImage;
	        //that.toolBarView = new ToolBarView(toolbarOptions);
	        this.userProfile = true;
	    	
	        if(!window.localStorage.getItem("User_Avtar_url")){
	        	try{
	        		getUserAvatar();
	        	}catch(e){
	        		setTimeout(function(){
//	        				if()
	        				getUserAvatar();
        				},400);
	        	}
	        	function getUserAvatar(){
	        		//var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory || "", refUrl = window.SIM_DWL_SRV+"/simulations/common/allspark/1.0.8.zip", uri = encodeURI(refUrl),
	        		var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? 'file:///data/data/org.ck12.simulations/files/' : 'file:///storage/emulated/0/Android/data/org.ck12.simulations/files/' || "", refUrl = window.SIM_DWL_SRV+"/simulations/common/allspark/1.0.8.zip", uri = encodeURI(refUrl),
		   				    fileURLfolder = fileURL;
		       	  	var targetFilePath = fileURLfolder+'allspark/assets/images/ur_avt.png';
		             	var ft = new FileTransfer();
		             	var self = this;
		             	ft.download(
		             			this.info.userImage,
		     	                targetFilePath,
		     	                function(entry){
		     	                	window.localStorage.setItem("User_Avtar_url",targetFilePath)
		     	                },
		     	                function(error){
		     	                	console.log("error in downloading :"+error);
		     	                }
		     	        );
	        	}
	        }
	   
       
	/*        this.UserProfileView = new UserProfileView(info);sssss
	        this.addView({
	            'UserProfileView': this.UserProfileView
	        });
	        this.showView('UserProfileView');
	        this.viewObjs['ToolBarView'].updateUser(toolbarOptions);*/


	    }
	 function openSignOut(e){
		 e.preventDefault();
			e.stopPropagation();
			setTimeout(function(){
				 document.querySelector("#UserProfileView").classList.remove('hide')
				 	document.getElementById("UserProfileView").addEventListener("click", function(e){
				e.stopPropagation();
			},false);
			},20);
	
		 
	 }
	 function goToLogin(e){
		if(checkDeviceConnectivity()){
			 e.preventDefault();
			 e.stopPropagation();
			 cleanAvtar();
		 }else{
			 showErrorMessage();
		 }
	 }
		function cleanAvtar(callback){
			// var path = path.toString();
		        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
		        function fail(evt) {
		            alert("FILE SYSTEM FAILURE");
		        }
		        function onFileSystemSuccess(fileSystem) {
		            fileSystem.root.getFile(
		            		"Android/data/org.ck12.simulations/files/allspark/assets/images/ur_avt.png",
		                {create : true, exclusive : false},
		                function(entry) {
		                entry.remove(function() {
//		                	window.localStorage.removeItem(path);
		                	 readerAppHelper.logout(function(data){
		            			 
		         				// readerAppHelper.clearUserInfo();
		                		 window.localStorage.removeItem("User_Avtar_url")
		         				 window.location.href = "../auth/login.html"
		                  });
		                	console.log("Vipin Bhai Chaa Gaye")
		                }, fail);
		            }, fail);
		        }
		    }
	 var touchStartEvent ;
	function init_cover(responseText){
		var onlineMode = checkDeviceConnectivity();
		coverHtml = responseText;
		bodyParent.innerHTML = coverHtml;
		_loadUserProfile();
		
		document.ontouchmove = function(event){
		/*    event.preventDefault();*/
		}
		document.ontouchstart = function(e){
			/* touchStartEvent = e*/
		}
		document.getElementsByClassName('close-modal')[0].addEventListener('click',closeIframe,false);
		document.getElementsByClassName('clear-box')[0].addEventListener('click',clearFilter,false);
		document.getElementsByClassName('nav-bottom')[0].addEventListener('click',deselectAllFilter,false);
		document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
		document.getElementsByClassName("user-avatar")[0].addEventListener("click",openSignOut,false)
		document.getElementsByClassName("signout")[0].addEventListener("click",goToLogin,false);
		document.getElementsByClassName("signout")[0].addEventListener("touch",goToLogin,false)
		document.getElementsByClassName("user-profile-container")[0].addEventListener("click touch",function(){
		
			e.preventDefault();
			e.stopPropagation();
		},false)
		/* copy this code for ios for msg*/ 
		ErrorMsgWindow  = document.getElementById("MessageView");
		ErrorMsgClose = document.getElementById('msgModalClose');
		/* copy this code for ios for msg*/ 
		ErrorMsgWindow.addEventListener('touchmove',function(e){
			e.preventDefault();
			e.stopPropagation();
		},false);
		ErrorMsgWindow.addEventListener('scroll',function(e){
			e.preventDefault();
			e.stopPropagation();
		},false);
		ErrorMsgClose.addEventListener('click',closeErrorMsg,false);
		
		filterWindow  = document.getElementsByClassName("filter-container")[0];
		filterWindow.addEventListener('scroll',function(e){
		//	document.getElementsByTagName("body")[0].style.overflow="hidden"
		/*	var e0 = e.originalEvent,
	        delta = e0.wheelDelta || -e0.detail;
	    
			this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
			e.preventDefault();*/

		},false);
		/************** video code ************/
		
		var InstructionVideo , 
		offlineTab  /**Code for delete **/,
		InstructionTutorial , 
		InstructionClose ,
		fullScreenInstruction ,
		iframeParent ,
		fullScreen = false , 
		instructionVideoFrame ,
		videoUrl = "https://www.youtube.com/embed/cmdBI54ew3M?wmode=opaque&amp;rel=0&amp;autohide=1&amp;wmode=transparent";
		
		InstructionVideo  = document.getElementsByClassName('InstructionVideo-screen')[0] ;
		offlineTab  = document.getElementById('offlineTab');  /**Code for delete **/ ;
		InstructionTutorial = document.getElementsByClassName('instructor-tutorial')[0] ;
		InstructionClose = document.getElementsByClassName('instruction-close')[0] ;
//		fullScreenInstruction = document.getElementsByClassName('full-screen-icon')[0] ;
		iframeParent = document.getElementsByClassName('iframe-parent')[0] ;
		instructionVideoFrame = document.getElementsByClassName('instruction-video-frame')[0] ;
		InstructionTutorial.addEventListener('click',initInstructionVideo,false);
		InstructionVideo.addEventListener('touchmove',function(e){
			e.stopPropagation();
		},false);
		InstructionVideo.addEventListener('scroll',function(e){
			e.stopPropagation();
		},false);
		
		InstructionClose.addEventListener('click',closeInstructionVideo,false);
		
//		fullScreenInstruction.addEventListener('click',togglefullScreen,false);
		function initInstructionVideo(e){
			
			if(checkDeviceConnectivity()){
				e.stopPropagation();
				
				readerAppHelper.addADSEvents('FBS_ACTION',{
	                
	                memberID: JSON.parse(localStorage.AuthUserInfo).response.id,
	                action_type:"button", 
	                action_name:"instruction_video", 
	                screen_name:"simulation_app_home"
	            });
				
				//document.getElementsByTagName("body")[0].style.overflow="hidden";
				if(document.getElementById("UserProfileView").classList.contains('hide')){
					document.getElementsByClassName("instruction-title")[0].innerHTML = "SIM INSTRUCTION TUTORIAL";
					instructionVideoFrame.setAttribute('src' , videoUrl);
					InstructionTutorial.classList.add('hide-back');
					InstructionVideo.classList.remove('hide');	
				}
				
			}else{
				showErrorMessage();
			}
		
			
		}
		
		function closeInstructionVideo(e){
			//document.getElementsByTagName("body")[0].style.overflow="auto"
			hideWorkSheeet();
			instructionVideoFrame.setAttribute('src' , '');
			InstructionTutorial.classList.remove('hide-back');
			InstructionVideo.classList.add('hide');
		
		}
		
		function togglefullScreen(e){
			fullScreen = !fullScreen;
			if(fullScreen){
				iframeParent.classList.add('full-screen-view');
				e.currentTarget.innerHTML = "Exit full screen";
			}
			else{
				iframeParent.classList.remove('full-screen-view');
				e.currentTarget.innerHTML = "Full screen";
			}
		}
		
		offlineTab.addEventListener('touchstart',initOfflineTab,false)  /**Code for delete **/;
		//offlineTab.addEventListener('touchstart',initOfflineTab,false);
		 /**Code for delete **/
		function initOfflineTab(e){
			e.stopPropagation();
			
			readerAppHelper.addADSEvents('FBS_ACTION',{
                memberID: JSON.parse(localStorage.AuthUserInfo).response.id,
                action_type:"toggle", 
                action_name:"offline_online", 
                screen_name:"simulation_app_home"
            });
			
			if(!offlineTab.classList.contains('toggle-button-selected')){
				sideNav.unselectAllCheckBox();
				if(sideNav2)sideNav2.unselectAllCheckBox();
				offlineTab.classList.add('toggle-button-selected');
				//offlineTab.classList.remove('inactive');
				downloadedMode = true;
		    	searchClick.value = "";
				showOfflineSims();
			}else{
				//offlineTab.classList.add('inactive');
				sideNav.unselectAllCheckBox();
				if(sideNav2)sideNav2.unselectAllCheckBox();
				offlineTab.classList.remove('toggle-button-selected');
				downloadedMode = false;
		    	searchClick.value = "";
				showAll();
			}
			document.getElementsByClassName('no-match-found')[0].classList.add('hide');
		}
		
		 /**Code for delete **/
		/************** video code ************/
		
		//code ios work
		
	
		
		
	/*	ajax.loadURL('http://gamma.ck12.org/flx/search/direct/modality/minimal/simulationint/internaltags.ext:featured?specialSearch=true&format=json',{
			//Featured sim API "http://gamma.ck12.org/flx/search/direct/modality/minimal/simulationint/internaltags.ext:featured?specialSearch=true&format=json"
			"callback" : function(response){
				
			
			}
		});*/
	    $.ajax({
            "url" : window.API_SERVER_URL + "/flx/search/direct/modality/minimal/simulationint/internaltags.ext:featured?specialSearch=true&format=json'",
            "success" : function(response){
                if(typeof response != "object")
                	response=JSON.parse(response);
                if(response.responseHeader.status === 0){
                	var abc = JSON.stringify(response.response.Artifacts.result)
    				localStorage.setItem("featured-sim",abc);
                }
                else{
                   console.log("error")
                }
            },
            "error" : function(response){
            	 console.log(response);
            }
            });
		 setTimeout(function(){ 
				if(localStorage.getItem("featured-sim")){
					var temp_array = JSON.parse(localStorage.getItem("featured-sim")); 
					ajax.loadURL('file:///data/data/org.ck12.simulations/files/simulationsData.json',{
						//Featured sim API "http://gamma.ck12.org/flx/search/direct/modality/minimal/simulationint/internaltags.ext:featured?specialSearch=true&format=json"
						"callback" : function(responseText){
							simData = JSON.parse(responseText);
							var fSSimArray = [];
							for(var j=0;j<simData.simulations.length;j++){
								if(!simData.simulations[j].hasOwnProperty('simVersionSupported'))
									simData.simulations[j].simVersionSupported=1;
							}

							for(var i = 0 ; i<temp_array.length;i++){
								simData.simulations.filter(function ( obj,index ) {
									if(obj.artifactID==JSON.parse(temp_array[i].id)){
//										simData.simulation.splice(i,1);
										var fs = simData.simulations.splice(index,1);
										fSSimArray.push(fs[0]);
									}
									
								})
							}
							simData.simulations = fSSimArray.concat(simData.simulations);
							
							var downloadSimCount=0;
							for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
								  var simURL = simData["simulations"][simCount].simulationUrl,
									simName = simURL.split('/')[0];
								  if(window.localStorage.getItem(simName)){
									  downloadSimCount++;
								  }
										
							  }
							
							if(!localStorage.getItem('simUpdateData')){
								var deffered = $.Deferred();
									deffered.done(function(updateData){
										localStorage.setItem('simUpdateData',JSON.stringify(updateData));
										simUpdateData = JSON.parse(localStorage.getItem('simUpdateData'));;
										checkForUpdates();
									});
									setSimUpdateData(deffered,downloadSimCount);
							}else{
								simUpdateData = JSON.parse(localStorage.getItem('simUpdateData'));								
							}
							init_simData();
							var stUrl ;
							if(!checkDeviceConnectivity()){
								stUrl = "json/standardsData.json";
							}else{
								stUrl =window.API_SERVER_URL+"/api/flx/get/branch/standards?set=NGSS&branch=SCI.PHY";
							}
							//ajax.loadURL('json/standardsData.json',{
							ajax.loadURL('file:///data/data/org.ck12.simulations/files/standardsData.json',{
								"callback" : setStandardObject
							});
						}
					});
				}else{
					ajax.loadURL('file:///data/data/org.ck12.simulations/files/simulationsData.json',{
						//Featured sim API "http://gamma.ck12.org/flx/search/direct/modality/minimal/simulationint/internaltags.ext:featured?specialSearch=true&format=json"
						"callback" : function(responseText){
							
							simData = JSON.parse(responseText);
							var downloadSimCount=0;

							for(var j=0;j<simData.simulations.length;j++){
								if(!simData.simulations[j].hasOwnProperty('simVersionSupported'))
									simData.simulations[j].simVersionSupported=1;
							}
							
							for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
								  var simURL = simData["simulations"][simCount].simulationUrl,
									simName = simURL.split('/')[0];
								  if(window.localStorage.getItem(simName)){
									  downloadSimCount++;
								  }
										
							  }
							if(!localStorage.getItem('simUpdateData')){
								var deffered = $.Deferred();
									deffered.done(function(updateData){
										localStorage.setItem('simUpdateData',JSON.stringify(updateData));
										simUpdateData = JSON.parse(localStorage.getItem('simUpdateData'));
										checkForUpdates();
									});
									setSimUpdateData(deffered,downloadSimCount);
							}else{
								simUpdateData = JSON.parse(localStorage.getItem('simUpdateData'));
								
							}
							init_simData();
							var stUrl ;
							if(!checkDeviceConnectivity()){
								stUrl = "json/standardsData.json";
							}else{
								stUrl =window.API_SERVER_URL+"/api/flx/get/branch/standards?set=NGSS&branch=SCI.PHY";
							}
							ajax.loadURL('file:///data/data/org.ck12.simulations/files/standardsData.json',{
								"callback" : setStandardObject
							});
						}
					});
				}
								
		}, 1000);
		 
		function setSimUpdateData(deffered,downloadSimCount){
			var data=[];
			var allsparkSupport = 200;
			var pckgDataCount =0;
			simData.simulations.forEach(function ( obj,index ) {
				var isLast  = (simData.simulations.length - 1 === index);
				data.push({
					'name':obj.name,
					'allsparkSupport':allsparkSupport
				});
				if(window.localStorage.getItem(obj.simulationUrl.split('/')[0])){
					var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, simURL = obj.simulationUrl,
						simName = simURL.split('/')[0],
						fileURLsimPackage = fileURL + simName + '/package.json';
					ajax.loadURL(fileURLsimPackage,{
						"callback":function(packageInfo){
							if(packageInfo){
								pckgDataCount++;
								packageInfo = JSON.parse(packageInfo);
								var minSupportedAppVersion =  packageInfo.minAppVersion || "1";
								var currentSimVersion = packageInfo.version || "1";
								currentSimVersion = currentSimVersion.split('.')[0];
								console.log(packageInfo);
								if(currentAppVersion>=minSupportedAppVersion){
									if(currentSimVersion==obj.simVersionSupported){
										allsparkSupport = 200;							//everything fine
									}else{
										allsparkSupport = 402;							//sim update required				
									}
								}else{
									allsparkSupport = 404;								//app update required
								}
								console.log(obj.name,allsparkSupport,index)
								for(var count in data){
									if(data[count].name == packageInfo.name){
										data[count].allsparkSupport = allsparkSupport;
										console.log(data[count].name,data[count].allsparkSupport,count);
										break;
									}
								}
							}
							if(pckgDataCount==downloadSimCount){
								deffered.resolve(data);
							}
						}
					});
				    
				}
				if(isLast && downloadSimCount==0)	deffered.resolve(data);
			});
//			localStorage.setItem('simUpdateData',JSON.stringify(data));
		} 
		
function setStandardObject(responseText){
			if(responseText!=""){
				localStorage.setItem("saved-standards",responseText);
				stdData = JSON.parse(responseText);
	            createSimCards();
	            arrangeStandards();
	            document.getElementsByClassName('no-match-found')[0].classList.add('hide');
	            
     
			}
}
     
     function init_standardsData(){}

		function checkForDownloadedSims(){
			
		}

	};
	
	/************** error Msg code ************/
	
	
	function showErrorMessage(e){
		/*e.stopPropagation();*/
		event.stopPropagation()
		ErrorMsgWindow.classList.remove('hide');
	};
	function closeErrorMsg(e){
		e.stopPropagation();
		ErrorMsgWindow.classList.add('hide');
	};
	
	/************** error Msg code ************/	
	function init_simData(){

		thumbnailCollection = document.getElementsByClassName('thumbnail-view-holder')[0];
		
		searchClick = document.getElementsByClassName('header-input')[0];
		searchClick.addEventListener('click',doNothing,false);
		searchClick.addEventListener('touchstart',doNothing,false);
		searchClick.addEventListener('keyup',searchItem,false);
		readerAppHelper.logScreenViewEventForApp("Browse Page");
		readerAppHelper.getGaSetUserId();
		searchClick.onpaste = function(ev){
			setTimeout(function(){
				//searchClick.focus();
				searchItem(ev);
			},100);
		}
		
		scrollContainer = document.getElementsByTagName('header')[0];
		
		document.getElementsByClassName('main-container')[0].addEventListener('scroll',scrollSims,false);
		document.getElementsByClassName("filter-tab")[0].addEventListener("click",filter,false)
		conceptNavParent = document.getElementsByClassName('concept-filter')[0];
		conceptNavParent.classList.add('concept-filter-list');
		standardsNavParent = document.getElementsByClassName('standard-filter')[0];
		standardsNavParent.classList.add('standards-filter-list');
		document.getElementsByTagName("body")[0].addEventListener('click',collapseSearch,false);
		document.getElementsByTagName("body")[0].addEventListener('touchstart',collapseSearch,false);
		 document.addEventListener("keydown",logPressedKeys,false);


		ajax.loadURL('file:///data/data/org.ck12.simulations/files/eids.json',{
			"callback" : init_conceptData
			
		});
	
		function filter(e){
			/*for(var i = 0;i<document.getElementsByClassName("sort-item").length;i++){
				document.getElementsByClassName("sort-item")[i].classList.remove("hide");
			}*/
			e.stopPropagation();
			if((document.getElementsByClassName("filter-main-wrapper")[0].classList.contains("go-left")))
			document.getElementsByClassName("filter-main-wrapper")[0].classList.remove("go-left");
			setTimeout(function(){
				var filterContHeight = window.innerHeight-140;
//				if(document.getElementsByClassName("filter-container")[0].style.height != filterContHeight +"px")
		    	document.getElementsByClassName("filter-container")[0].style.height = filterContHeight +"px";
			},1000);
			
		}
		function init_conceptData(responseText){
			document.getElementsByClassName("header-input")[0].disabled =false;
			eidsData = JSON.parse(responseText);
			
			createSimCards();
			arrangeConcepts();
			//arrangeStandards();
			
			for(var groupCount = 0; groupCount < newStandardsArray.length; groupCount++){
				newStandardsArray[groupCount]["data"].sort();
			}
			
			document.getElementsByClassName("filter-main-wrapper")[0].addEventListener('click',doNothing,false);
//			document.getElementsByClassName("filter-container")[0].style.height = window.innerHeight-140-39 +"px";
			document.getElementsByClassName("filter-container")[0].style.height = window.innerHeight-140 +"px";
			
			document.getElementsByClassName("filter-menu-wrapper")[0].addEventListener('click',toggleExpand,false);
			document.getElementsByClassName("filter-menu-wrapper")[1].addEventListener('click',toggleExpand,false);
			
			var options = {
					parent: conceptNavParent,
					data: newConceptsArray,
					simData: simData,
					search: function(names){
						showSearchedSimsWithConcepts(names);
					},
					setSearched: function(isConceptSelected){
						setConceptSelection(isConceptSelected);
					}
			};
			window.sidenav = new SideNavigation(options);
			sideNav = window.sidenav;
			var sideNavButton = document.getElementsByClassName('sort-box-concept')[0];
			sideNavButton.addEventListener('click',sideNav.openSideNavScreen.bind(sideNav),false);
			sideNavButton.addEventListener('touchstart',doNothing,false);
			
			document.addEventListener('click',sideNav.closeSideNavScreen.bind(sideNav),false);
			document.addEventListener('touchstart',sideNav.closeSideNavScreen.bind(sideNav),false);
			
			document.getElementsByClassName('back-arrow')[0].addEventListener('click',collapseSearch,false);
			
			checkIncomingUrl();
			
			if(window.innerWidth<900){
				var navPs = document.getElementsByClassName('sort-item');
				var navCs = document.getElementsByClassName('side-nav-screen');
				document.getElementsByClassName('clear-item')[0].style.paddingLeft = "10px";
				for(var i=0;i<navPs.length;i++){
					navPs[i].style.width = '270px';
					navCs[i].style.width = '270px';
				}
			}
			
		}
	}
	
	function checkDeviceConnectivity(){
		  /* var xhr = new XMLHttpRequest();
			var file = window.API_SERVER_URL+'/assessment/api/app/versions?appName=ck12sims';
	        var r = Math.round(Math.random() * 10000);
	        xhr.open('HEAD', file + "?subins=" + r, true);
	        try {
	            xhr.send();
	            if (xhr.status >= 200 && xhr.status < 304) {
	                return true;
	            } else {
	                return false;
	            }
	        } catch (e) {
	            return false;
	        }*/

	        if(navigator.connection.type != "none"){
	        	return true;
	        }else{
	        	return false;
	        }
	};
	
	function checkIncomingUrl(){
		var queryString=[],conceptsPassed=[];
		
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = params[i].split('=')[1];
                queryString[key] = value;
            }
            if (queryString["backUrl"] != null) {
            	backUrl = queryString["backUrl"];
            	document.getElementsByClassName('back-button')[0].classList.remove('hide-back');
            	document.getElementsByClassName('back-button')[0].addEventListener('click',goToBackUrl,false);
            }
            if (queryString["c"] != null) {
            	var concepts = queryString["c"].split(",");
                for (var i = 0; i < concepts.length; i++) {
                	var fullConcept = concepts[i].split("%20");
                	concepts[i] = fullConcept[0];
                	for (var j = 1; j < fullConcept.length; j++) {
                		concepts[i] += " "+fullConcept[j];
                    }
                	conceptsPassed.push(concepts[i].toLowerCase());
                }
            }
            if (conceptsPassed.length != 0) {
            	hideAll();
            	showSearchedSimsWithConcepts(conceptsPassed);
            	sideNav.selectCheckBox(conceptsPassed);
            }
        }
	}

	function goToBackUrl(){
		window.location.href = backUrl;
	}
	
	function doNothing(e){
		e.stopPropagation();
		document.querySelector("#UserProfileView").classList.add('hide');
		if(!(document.getElementsByClassName("filter-main-wrapper")[0].classList.contains("go-left")) && !e.target.classList.contains("filter-menu-wrapper") && !e.target.parentElement.classList.contains("filter-menu-wrapper"))
		document.getElementsByClassName("filter-main-wrapper")[0].classList.add("go-left");	
	}
	
	function toggleExpand(e){
		var fiter_type = (e.target.textContent =="Filter by Concepts") || (e.target.firstChild?e.target.firstChild.textContent =="Filter by Concepts":false) || (e.target.previousSibling?e.target.previousSibling.textContent =="Filter by Concepts":false) ? "concept":"standards";
		e.stopPropagation();
		e.currentTarget.nextElementSibling.classList.toggle('hide');
		e.currentTarget.childNodes[1].classList.toggle('wrapper-plus-icon');
		 readerAppHelper.addADSEvents('FBS_SIMULATION_BROWSE_FILTER',{
             
            filterType : fiter_type
         });
	}
	function checkForUpdates(){
		if(document.getElementsByClassName('tile-download')[87]){
			for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
				  var cardDownload = document.getElementsByClassName('tile-download')[simCount];
				  var simURL = simData["simulations"][simCount].simulationUrl,
					simName = simURL.split('/')[0];
				  if(window.localStorage.getItem(simName)){
//					  cardDownload.classList.add("downloaded");
//					  downloadedSims.push(simName);
//					  anySimDownloaded = true;
					  if(simUpdateData[simCount].allsparkSupport == 404){
						  cardDownload.classList.add("update-available");
					  }else if(simUpdateData[simCount].allsparkSupport == 402){
						  cardDownload.classList.add("update-available");
					  }else{
						  cardDownload.classList.remove("update-available");
					  }
				  }
			  }
		}		
	}
	function createSimCards(){
		var offlineTab  = document.getElementById('offlineTab');  /**Code for delete **/ ;
		thumbnailCollection.innerHTML = "";
		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			createIthCard(simCount);
		}
		if(anySimDownloaded){
			if(offlineTab.classList.contains('toggle-button-selected')){
          	  offlineTab.classList.remove('toggle-button-selected');
          	  //offlineTab.classList.add('inactive');
            }			
			document.getElementsByClassName('toggle-button-container')[0].classList.remove('opacityZero');
			document.getElementsByClassName('toggle-button-container')[0].classList.remove('hideOffline');
		}else{
			document.getElementsByClassName('toggle-button-container')[0].classList.add('hideOffline');
		}
		checkForUpdates();
	}
	function deselectAllFilter(e){
		e.stopPropagation();
		sideNav.unselectAllCheckBox();
		sideNav2.unselectAllCheckBox();
    	//this.showAll();
    	//document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
		sideNav.setSearched(false);
		sideNav2.setSearched(false);
	}
	function clearFilter(e){
		e.stopPropagation();
		sideNav.unselectAllCheckBox();
		//sideNav2.unselectAllCheckBox();
		showAll();
		document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
		
		if(searchClick.value){
			document.getElementsByClassName('no-match-found')[0].classList.add('hide');
			searchClick.value='';
		}
		simSelected=false;
		nameOfConcepts=[],nameOfStandards=[];
	}
	function showOfflineSims(){
		hideAll();
		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, simURL = simData["simulations"][simCount].simulationUrl,
//			var simURL = simData["simulations"][simCount].simulationUrl,
					simName = simURL.split('/')[0];
			if(window.localStorage.getItem(simName)){
//				if(simName==='violin' || simName==='prom-night'){
				showDownloaded(simCount);
				notFound=false;
			}
		}
	}
	function showDownloaded(simCount){
		var card = document.getElementsByClassName('thumbnail-view')[simCount],
		cardDelete = document.getElementsByClassName('tile-delete')[simCount],
		cardDownload = document.getElementsByClassName('tile-download')[simCount];
		card.classList.remove('hide-back');
		cardDelete.classList.remove('hide');
		cardDownload.classList.add('hide');
	}
	function createIthCard(simCount){
		var card = document.createElement("div");
		card.classList.add('thumbnail-view');
		card.classList.add('thumbnail-view'+simCount);
		thumbnailCollection.appendChild(card);
		
		var cardImage = document.createElement("div");
		cardImage.classList.add('tile-image');
		card.appendChild(cardImage);
		var thumbimage = document.createElement("img");
		cardImage.appendChild(thumbimage);
		thumbimage.classList.add('tile-thumbimage');
		thumbimage.src = ""+simData["simulations"][simCount].thumbnailUrl+"";
		var t = ""+simData["simulations"][simCount].simulationUrl+"";
		thumbimage.alt = "physics-simulations-"+t.split('/')[0];
		//cardImage.style.backgroundImage = "url(http://simtest.ck12.org/simulations/repository/"++")";
		
		if(simData["simulations"][simCount].simulationUrl.match(/window.match_url/i)){
			thumbimage.src = "url("+simData["simulations"][simCount].thumbnailUrl+")";
		}
		if(simData["simulations"][simCount].simulationUrl == ""){
			cardImage.classList.add('comming-soon');
		}
		
		cardImage.setAttribute("id",simData["simulations"][simCount].name);
		
		var cardImageName = document.createElement("div");
		cardImageName.classList.add('tile-image-name');
		cardImage.appendChild(cardImageName);
		
		var simName = document.createElement("h2");
		simName.classList.add('sim-title');
		simName.innerHTML = simData["simulations"][simCount].name;
		cardImageName.appendChild(simName);
		
		var cardDownload = document.createElement("div");
		cardDownload.classList.add('tile-download');
		cardImage.appendChild(cardDownload);
//		cardDownload.addEventListener('click',downloadSim,false);
		
		/*Code for delete */
		var cardDelete = document.createElement("div");
		cardDelete.classList.add('tile-delete');
		cardDelete.classList.add('hide');
		cardImage.appendChild(cardDelete);
//		cardDelete.addEventListener('click',deleteSim,false);
		/*Code for delete */
				
		var simDesc = document.createElement("div");
		simDesc.classList.add('sim-desc');
		card.appendChild(simDesc);

		var simCovers = document.createElement("div");
		simCovers.classList.add('sim-covers-desc');
		simDesc.appendChild(simCovers);
		
		var simConceptsCover = document.createElement("div");
		simConceptsCover.classList.add('sim-covers');
		simCovers.appendChild(simConceptsCover);

		var simConcepts = document.createElement("div");
		simConcepts.classList.add('sim-covers-concepts');
		simConceptsCover.appendChild(simConcepts);
		simConcepts.innerHTML = "<span class='sim-info sim-covers-focused'>CONCEPTS</span>";
		simConcepts.addEventListener('click',showCovers,false);
		
		var simStandardsCover = document.createElement("div");
		simStandardsCover.classList.add('sim-covers');
		simCovers.appendChild(simStandardsCover);
		
		var simStandards = document.createElement("div");
		simStandards.classList.add('sim-covers-standards');
		simStandardsCover.appendChild(simStandards);
		simStandards.innerHTML = "<span class='sim-info'>STANDARDS</span>";
		simStandards.addEventListener('click',showCovers,false);
		
		var simConceptsTags = document.createElement("div");
		simConceptsTags.classList.add('sim-covers-tags');
		simDesc.appendChild(simConceptsTags);
		
		var simConceptsTagsChild = document.createElement("div");
		simConceptsTagsChild.classList.add('sim-covers-tags');
		simConceptsTagsChild.classList.add('sim-sim-cover');
		simConceptsTags.appendChild(simConceptsTagsChild);
		
		var moreLessParent = document.createElement("div");
		moreLessParent.classList.add('button-less-more');
		moreLessParent.classList.add('hide');
		simConceptsTags.appendChild(moreLessParent);
		
		var moreLessSwitch = document.createElement("div");
		moreLessSwitch.classList.add('button');
		moreLessSwitch.classList.add('less');
		moreLessSwitch.classList.add('more');
		
		//moreLessSwitch.innerHTML = '<span class="more" id ="moreLessButton">More &gt;</span>'
		moreLessParent.appendChild(moreLessSwitch);
		moreLessSwitch.addEventListener("click",moreLess,false);
		
		var mlBtn = document.createElement("span");
		mlBtn.classList.add('more');
		mlBtn.classList.add('more-btn');
		mlBtn.classList.add('lable');
		mlBtn.innerHTML = "More";
		moreLessSwitch.appendChild(mlBtn);
		
		var mlBtnIcon = document.createElement("span");
		mlBtnIcon.classList.add('image');
		mlBtnIcon.classList.add('more-btn');
		
		moreLessSwitch.appendChild(mlBtnIcon);

		var simStandardsTags = document.createElement("div");
		simStandardsTags.classList.add('sim-covers-tags');
		simStandardsTags.classList.add('sim-covers-tags-s');
		simDesc.appendChild(simStandardsTags);

		var simStdDescView = document.createElement("div");
		simStdDescView.classList.add('sim-std-desc-view');
		simStdDescView.classList.add('hide');
		simDesc.appendChild(simStdDescView);
		
		//code resource/
		if(simData["simulations"][simCount].document_id){
			
			var simRes = document.createElement("div");
			simRes.classList.add('sim-covers-res');
			simDesc.appendChild(simRes);
			simRes.addEventListener('click',initWorkSheet,false)
			
			var simResources = document.createElement("div");
			simResources.classList.add('sim-covers-resources');
			simRes.appendChild(simResources);
			simResources.innerHTML = "<span class='sim-info'>RESOURCES</span>";
			
			var simResArrow = document.createElement("div");
			simResArrow.classList.add('sim-res-arrow');
			simRes.appendChild(simResArrow);
		}else{
			simConceptsTags.classList.add('no-resources');
			card.classList.add('no-resources');
		}
		var ccstore = [];
		for(var simConceptCount = 0; simConceptCount<simData["simulations"][simCount].concepts.length; simConceptCount++){
			var simConceptName = document.createElement("a");
			simConceptsTagsChild.appendChild(simConceptName);
			var conceptId = simData["simulations"][simCount].concepts[simConceptCount];
			
			if(simConceptCount<(simData["simulations"][simCount].concepts.length-1)){
				setConceptName(conceptId);
				simConceptName.title = "Physics Simulations and Interactives\- "+simConceptsName;
				simConceptName.innerHTML = " "+simConceptsName;
				ccstore.push(simConceptsName);
				var simConceptSeperator = document.createElement("span");
				simConceptsTagsChild.appendChild(simConceptSeperator);
				simConceptSeperator.innerHTML = ",";
			}
			else{
				setConceptName(conceptId);
				simConceptName.title = "Physics Simulations and Interactives\- "+simConceptsName;
				simConceptName.innerHTML = " "+simConceptsName;
				ccstore.push(simConceptsName);
			}
			//simConceptName.setAttribute("href","http://www.ck12.org/Physics/"+simConceptsHandle);
			simConceptName.refValue = simConceptsHandle;
//			simConceptName.last_click_time = new Date().getTime();
			
			simConceptName.addEventListener('click',function(e){
				
				openIframe(this);
			},false);
			
			if(stdData && stdData.response.concepts[conceptId]){
				var standardId = stdData.response.concepts[conceptId].standards;
				setStandardName(standardId);
			}
		}
		if(ccstore.toString().length>125){
			moreLessParent.classList.remove("hide");
			moreLessParent.parentElement.parentElement.parentElement.classList.add("readMore");
		}
		if(standardIds.length>0){
			for(var simStandardCount = 0; simStandardCount<standardIds.length; simStandardCount++){
				var simStandardName = document.createElement("a");
				simStandardsTags.appendChild(simStandardName);
				
				if(simStandardCount<(standardIds.length-1)){
					simStandardName.title= "Physics Simulations and Interactives\- "+simStandardsName[simStandardCount];
					simStandardName.innerHTML = " "+simStandardsName[simStandardCount];
					
					var simStandardSeperator = document.createElement("span");
					simStandardsTags.appendChild(simStandardSeperator);
					simStandardSeperator.innerHTML = ",";
				}
				else{
					simStandardName.title= "Physics Simulations and Interactives\- "+simStandardsName[simStandardCount];
					simStandardName.innerHTML = " "+simStandardsName[simStandardCount];
				}
				simStandardName.refValue = simStandardsDesc[simStandardCount];
				simStandardName.addEventListener('click',showStdDesc,false);
			}
		}
		else{
			simStandardsCover.classList.add('hide-back');
		}
		standardIds = [],standardDesc=[],firstSimStandard=true;
		var simURL = simData["simulations"][simCount].simulationUrl;
		var simName = simURL.split('/')[0];
		if(window.localStorage.getItem(simName)){
//		if(simName==='violin' || simName==='prom-night'){
			cardDownload.classList.add("downloaded");
			downloadedSims.push(simName);
			anySimDownloaded = true;
//			if(simUpdateData[simCount].allsparkSupport == 402 || simUpdateData[simCount].allsparkSupport == 404){
//				cardDownload.classList.add("update-available");
//			}else{
//				cardDownload.classList.remove("update-available");
//			}
		}else{
			cardDownload.classList.remove("downloaded");
		};
	
		downloadedSims = downloadedSims.filter(function(elem, pos) {
		    return downloadedSims.indexOf(elem) == pos;
		});
//		if(simName==='violin' || simName==='prom-night'){
//			cardDownload.classList.add("update-available")
//		}
//		cardImage.addEventListener('click',openSim,false);
		cardImage.addEventListener('click',simTasks,false);

		document.getElementsByClassName('sim-covers-concepts')[simCount].addEventListener('click',showConcepts,false);
		document.getElementsByClassName('sim-covers-standards')[simCount].addEventListener('click',showStandards,false);
		simStandardsTags.classList.add('hide-back');
	}
	function simTasks(e){		
		var simId='';
		if(e.target.classList.contains('tile-thumbimage')){
			simId = e.target.parentElement.id;
			if(document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.contains('update-available')){
				showSimUpdate(simId);
			}else{
				openSim(simId);			
			}
		}else if(e.target.classList.contains('sim-title')){
			simId = e.target.parentElement.parentElement.id;
			if(document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.contains('update-available')){
				showSimUpdate(simId);
			}else{
				openSim(simId);			
			}
		}else if(e.target.classList.contains('tile-download') && !e.target.classList.contains('update-available')){
			simId = e.target.parentElement.id;
			if(document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.contains('update-available')){
				showSimUpdate(simId);
			}else if(document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.contains('downloaded')){
				openSim(simId);			
			}else if(!document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.contains('downloaded')){
				downloadSim(simId);		
			}
//			downloadSim();
		}else if(e.target.classList.contains('update-available')){
			simId = e.target.parentElement.id;
			showSimUpdate(simId);
		}else if(e.target.classList.contains('tile-delete')){
			simId = e.target.parentElement.id;
			deletePermission(simId);
		}
	}
	function deletePermission(simId){
		if(document.getElementById('deletePermissionView')){
			document.getElementById('deletePermissionView').classList.remove('hide');
			$('#deletePermissionView #yes').off('click').on('click', function(){
	        	deleteSim(simId);
	        });
		}else{
			var deletePermissionView = document.createElement('div');
			deletePermissionView.id = "deletePermissionView";
			var strVar="";
			strVar += "<div class=\"delete-permission-container\">";
			strVar += "				<div class=\"delete-text-container\">";
			strVar += "					<div class=\"error-header\">Are you sure you want to delete this Simulation?<\/div>";
			strVar += "				<\/div>";
			strVar += "				<div class=\"delete-button-container\"><div id=\"yes\" class=\"delete-confirm-button\">YES<\/div><div id=\"no\" class=\"delete-confirm-button\">NO<\/div><\/div>";
			strVar += "			<\/div>";

			deletePermissionView.innerHTML = strVar;
			document.body.appendChild(deletePermissionView);
			
			$('#deletePermissionView #no').off('click').on('click', function(){
				$('#deletePermissionView').addClass('hide');
	        });	
			$('#deletePermissionView #yes').off('click').on('click', function(){
	        	deleteSim(simId);
	        });
		}
	}
	function showConcepts(e){
		e.currentTarget.parentElement.parentElement.parentElement.childNodes[2].classList.add('hide-back');
		e.currentTarget.parentElement.parentElement.parentElement.childNodes[1].classList.remove('hide-back');
	}
	function moreLess(e){
		e.stopPropagation();
		var parent = this.parentElement.parentElement.parentElement.parentElement;
		if(!parent.classList.contains("expand")){
			parent.classList.add("expand")
			this.getElementsByClassName("lable")[0].innerHTML = "Less"
		}else{
			parent.classList.remove("expand")
			this.getElementsByClassName("lable")[0].innerHTML = "More"
		}
	}
	function showStandards(e){
		e.currentTarget.parentElement.parentElement.parentElement.childNodes[1].classList.add('hide-back');
		e.currentTarget.parentElement.parentElement.parentElement.childNodes[2].classList.remove('hide-back');
	}

	var lastSimStdShowed,lastSimStd;
	function showStdDesc(e){
		e.stopPropagation();
		if(lastSimStdShowed){
			lastSimStdShowed.classList.add('hide');
			lastSimStd.style.fontWeight = 'normal';
		}
		
		lastSimStdShowed = e.currentTarget.parentElement.parentElement.childNodes[3];
		lastSimStdShowed.classList.remove('hide');
		lastSimStdShowed.innerHTML = e.currentTarget.refValue;
		
		lastSimStd = e.currentTarget;
		lastSimStd.style.fontWeight = 'bold';
		
		var artifactID='';
		for (var simCount = 0; simCount < simData["simulations"].length; simCount++) {
			if(e.target.parentElement.parentElement.previousElementSibling.id === simData["simulations"][simCount].name){
				artifactID = simData["simulations"][simCount].artifactID;
				break;
			}
		}
		
		readerAppHelper.addADSEvents('FBS_ACTION',{
            
            memberID: JSON.parse(localStorage.AuthUserInfo).response.id,
            action_type:"link", 
            action_name:"standards", 
            screen_name:"simulation_app_home",
            additional_params1: artifactID, //(artifactID of the simulation)
            additional_params2: e.currentTarget.innerHTML //(Standard ID that was clicked on)
        });
		
	}
	
	function showCovers(e){
		var  isTabType ;
		for(var i=0;i<2;i++){
			e.currentTarget.parentElement.parentElement.childNodes[i].childNodes[0].childNodes[0].classList.remove('sim-covers-focused');
		}
		e.currentTarget.childNodes[0].classList.add('sim-covers-focused');
		
		if(e.target.innerHTML.indexOf('STANDARDS') > -1){
			isTabType = "standards" ;
		}else if(e.target.innerHTML.indexOf('CONCEPTS') > -1){
			isTabType = "concept" ;
    	}
		  readerAppHelper.addADSEvents('FBS_SIMULATION_TILE_TAB',{
             // action_name:'FBS_SIMULATION_TILE_TAB',
              "tabType" : isTabType
          });
		/*dexterjs.logEvent("FBS_SIMULATION_TILE_TAB", {
			
			"tabType" : isTabType
          
        });*/
		
	}
	/***********************************************WorkSheet intigration******************************************************/ 
	var artifact_Document = [];
	function hideWorkSheeet(){
		document.getElementById("instructionContainer").classList.remove("padding-zero");	
		document.getElementsByClassName("instruction-title")[0].innerHTML = "";
		document.getElementById("seprate").classList.add("hide");
		document.getElementsByClassName("instruction-title")[0].classList.remove("worksheet-title");
	}
	function showWorkSheeet(){
		document.getElementsByClassName("filter-main-wrapper")[0].classList.add("go-left");
		document.getElementById("instructionContainer").classList.add("padding-zero");	
		document.getElementsByClassName("instruction-title")[0].innerHTML = "Worksheet";
		document.getElementsByClassName("instruction-title")[0].classList.add("worksheet-title");
		document.getElementById("seprate").classList.remove("hide");	
		document.getElementsByClassName('instructor-tutorial')[0].classList.add('hide-back');
		document.getElementsByClassName('InstructionVideo-screen')[0].classList.remove('hide');
	}

	function checkDocument(name){
		var available =false,output={},id ="";
		simData.simulations.filter(function ( obj ) {
			if(obj.name==name){
				available =  true;
				id = obj.document_id || "f84a1133dfb746e7a758bb90e06a0eec"	
			}
		})
		output = {
				"available":available,
				"document_id":id
			};
		return output 
	}
	function initWorkSheet(e){
		if(!checkDeviceConnectivity()){
			showErrorMessage();
		}else{
			console.log(e.target);
			e.stopPropagation();
			var artifactID = "",name = '';
			showWorkSheeet();

			simData.simulations.forEach(function(elem, i ){
			if( (e.target.parentElement.parentElement.previousSibling ? elem.name === e.target.parentElement.parentElement.previousSibling.id : false)|| (e.target.parentElement.parentElement.parentElement.previousSibling ? elem.name === e.target.parentElement.parentElement.parentElement.previousSibling.id :false) || (e.target.parentElement.previousSibling ? elem.name === e.target.parentElement.previousSibling.id :false) ){
				artifactID = simData.simulations[i].artifactID;
				name = elem.name;
				avl_doc_id =  simData.simulations[i].document_id || "" ; 
			}
				
				
			})
			//var avl_doc  = checkDocument(name);
			getWorkSheetSession(avl_doc_id);
		}

		
	
	}
	/*** to get document id****/
	function initiateWorkSheetDoc(artifactID,name){
		ajax.loadURL(window.API_SERVER_URL+"/flx/get/info/artifact/resources/"+artifactID+"/inlineworksheet?format=json",{
			withCredentials:true,
			callback:function(response){
			console.log(response +"&^*&$%^$^")
			console.log(artifact_Document+" "+artifact_Document.length)
			response = JSON.parse(response)	
			if(response.response.resources.length!=0){
				var doc_object = {"name":name,"document_id":response.response.resources[0]["boxDocuments"].documentID};
				artifact_Document.push(doc_object);
				console.log(artifact_Document+" "+artifact_Document.length)
				getWorkSheetSession(response.response.resources[0]["boxDocuments"].documentID)
				
			}
			else{
				console.log("Content is Not available")
				}
			}
			
		})
	
	}
	function getWorkSheetSession(document_id){
		console.log(artifact_Document+" "+artifact_Document.length)
		//var testUrl = "https://view-api.box.com/1/sessions/4cac876330214114bf44a8b524938e8e/view?theme=light"
		var baseUrl = "https://view-api.box.com/1/sessions/",document_id = document_id ,theme= "/view?theme=light";
		console.log("doc_object :"+artifact_Document)
			$.ajax({
				type:"GET",
				url  :window.API_SERVER_URL+"/flx/get/box/viewer/session?document_id="+document_id,
				success:function(data){
				if(typeof data != "object")
					data = JSON.parse(data);
				var session_id = data.response.session;
				//console.log(data)
				document.getElementsByClassName('instruction-video-frame')[0].setAttribute('src' , baseUrl+session_id+theme);
				
				},
				error:function(error){
					alert(error+"=PDF FINDING ERROR")
				}
				
			})
	
	
		
	
	}
	/***********************************************WorkSheet intigration******************************************************/
	function openIframe(e){
		event.stopPropagation();
		if(!checkDeviceConnectivity()){
			showErrorMessage();
		}else{
			//document.getElementsByTagName("body")[0].style.overflow="hidden";
			//var modalHeight = Math.max((document.getElementsByClassName('main-container')[0].clientHeight + 88),(window.innerHeight-118));
			//document.getElementsByClassName('modal-window')[0].classList.remove('hide');
			//document.getElementsByClassName('modal-window')[0].style.height = modalHeight+"px"; 
			//document.getElementsByClassName('iframe-container')[0].style.top = window.scrollY + 40 + "px";
			//OLD URL var refUrl = "http://www.ck12.org/embed/#module=concept&handle="+e.refValue+"&branch=physics&filters=&nochrome=true/referrer=simulation_tile";
			/**NEW URL**/
			//var refUrl = window.API_SERVER_URL+"/embed/#module=concept&handle="+e.refValue+"&filters=text,multimedia&branch=Physics&view_mode=embed&utm_source=browsePage&utm_medium=web&utm_campaign=Embed&referrer=ck12simulations_app&nochrome=true";
			var targetLocalID = e.refValue.replace(/(physics-\:\:-)/,'');
			var refUrl = window.API_SERVER_URL+"/embed/#module=concept&handle="+targetLocalID+"&filters=text,multimedia&branch=Physics&view_mode=embed&utm_source=browsePage&utm_medium=web&utm_campaign=Embed&referrer=ck12simulations_app&nochrome=true";
			//document.getElementsByClassName('i-frame')[0].setAttribute("src",refUrl);
//			window.open(refUrl, '_blank', 'location=no,zoom=no,enableViewportScale=no');

			if(isConceptClosed){
				// isConceptClosed = false;
				//conceptBrowser = window.open(refUrl, '_blank', 'location=no,zoom=no,enableViewportScale=no');
				document.getElementsByClassName("iframe-parent-sim")[0].classList.remove("hide");
				document.getElementsByClassName('instruction-video-frame-sim')[0].setAttribute("src",refUrl);

			}			
			// conceptBrowser.addEventListener('exit',function closeCon(){
			// 	isConceptClosed = true;
			// 	conceptBrowser.removeEventListener('exit',closeCon);
			// });
		}
		
	};

	function closeIframe(){
		event.stopPropagation();
		//document.getElementsByTagName("body")[0].style.overflow="auto";
		document.getElementsByClassName('modal-window')[0].classList.add('hide');
		document.getElementsByClassName('i-frame')[0].setAttribute("src","");
	}
	function logPressedKeys(e) {
	    console.log(e.keyCode);
	    if (e.keyCode==13) {
	      e.preventDefault();
	      console.log('Enter spotted: prevent!');
	      temp=document.activeElement;
	      //console.log(temp);
	      temp.blur();
	      return false;
	    }
	    return true;
	}
	function goBackToLauncher(){
		var iFrame = document.getElementsByClassName('i-frame')[0];
		iFrame.setAttribute("src","");
		iFrame.classList.add('hide');
		document.getElementsByClassName('thumbnail-view-holder')[0].classList.remove('hide');
		document.getElementsByClassName('side-navigation-button')[0].classList.remove('hide');
		document.getElementsByClassName('go-back')[0].classList.add('hide');
		document.getElementsByClassName('search-box')[0].classList.remove('hide');
	}
	
	var simConceptsName,simConceptsHandle, firstConcept=true;
	function setConceptName(conceptId){
		var presentConcept=false;
		simConceptsName = "";
		for(var eidsConceptCount = 0; eidsConceptCount<eidsData["concepts"].length; eidsConceptCount++){
			if(conceptId == eidsData["concepts"][eidsConceptCount].encodedID){
				simConceptsName = eidsData["concepts"][eidsConceptCount].name;
				simConceptsHandle = eidsData["concepts"][eidsConceptCount].handle;
			}
		}

		for(var arrayLength = 0; arrayLength<conceptsArray.length; arrayLength++){
			if(conceptsArray[arrayLength]==simConceptsName){
				presentConcept = true;
			}
		}
		if(firstConcept || !presentConcept){
			conceptsArray.push(simConceptsName);
			firstConcept = false;
		}
	}
	
	var group1=[],group2=[],group3=[],group4=[],group5=[],group6=[],
		newConceptsArray=[{name:"Motion and Force",data:group1},{name:"Momentum, Work, Power, and Energy",data:group2},{name:"Waves",data:group3},{name:"Electricity and Magnetism",data:group4},{name:"Atom",data:group5},{name:"Introduction to Physics",data:group6}];
	
	function arrangeConcepts(){
		// for(var eidsConceptCount = 0; eidsConceptCount<eidsData["concepts"].length; eidsConceptCount++){
		// 	for(var conceptCount = 0; conceptCount < conceptsArray.length; conceptCount++){
		// 		if(eidsData["concepts"][eidsConceptCount].name == conceptsArray[conceptCount]){
		// 			for(var groupCount = 0; groupCount < newConceptsArray.length; groupCount++){
		// 				if(eidsData["concepts"][eidsConceptCount].category == newConceptsArray[groupCount]["name"]){
		// 					newConceptsArray[groupCount]["data"].push(conceptsArray[conceptCount]);
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		var eidsConceptCount, conceptCount, groupCount, conceptGroup;
        for (eidsConceptCount = 0; eidsConceptCount < eidsData.concepts.length; eidsConceptCount++) {
            for (conceptCount = 0; conceptCount < conceptsArray.length; conceptCount++) {
                if (eidsData.concepts[eidsConceptCount].name === conceptsArray[conceptCount]) {
                    conceptGroup = newConceptsArray.find(function(item) {
                        return item.name === eidsData.concepts[eidsConceptCount].category;
                    });
                    if (!conceptGroup) {
                        conceptGroup = {
                            'name': eidsData.concepts[eidsConceptCount].category,
                            'data': []
                        };
                        newConceptsArray.push(conceptGroup);
                    }
                    conceptGroup.data.push(conceptsArray[conceptCount]);
                }
            }
        }
	}

	var simStandardsName,simStandardsHandle,firstStandard=true,firstSimStandard=true,standardIds=[],standardDesc=[],simStandardsDesc;
	function setStandardName(standardId){
		var presentStandard=false,presentSimStandard=false;
		simStandardsName = standardId;
		for(var arrayCount = 0; arrayCount < simStandardsName.length; arrayCount++){
			for(var arrayLength = 0; arrayLength<standardsArray.length; arrayLength++){
				if(standardsArray[arrayLength]["label"]==stdData.response.standards[simStandardsName[arrayCount]].label){
					presentStandard = true;
				}
			}
			if(firstStandard || !presentStandard){
				standardsArray.push({label:stdData.response.standards[simStandardsName[arrayCount]].label,description:stdData.response.standards[simStandardsName[arrayCount]].description,ancestors:stdData.response.standards[simStandardsName[arrayCount]].ancestors});
				firstStandard = false;
			}
			
			for(var arrayLength = 0; arrayLength<standardIds.length; arrayLength++){
				if(standardIds[arrayLength]==stdData.response.standards[simStandardsName[arrayCount]].label){
					presentSimStandard = true;
				}
			}
			if(firstSimStandard || !presentSimStandard){
				firstSimStandard = false;
				standardIds.push(stdData.response.standards[simStandardsName[arrayCount]].label);
				standardDesc.push(stdData.response.standards[simStandardsName[arrayCount]].description);
			}
			presentSimStandard=false;
		}
		simStandardsName = standardIds;
		simStandardsDesc = standardDesc;
	}

	var groupS1=[],groupS2=[],groupS3=[],groupS4=[],newStandardsArray=[{name:"MS-ESS",data:groupS1},{name:"MS-PS",data:groupS2},{name:"HS-ESS",data:groupS3},{name:"HS-PS",data:groupS4}];
	
	function arrangeStandards(){
		for(var standardCount = 0; standardCount < standardsArray.length; standardCount++){
			for(var groupCount = 0; groupCount < newStandardsArray.length; groupCount++){
				if(standardsArray[standardCount]["label"].match(newStandardsArray[groupCount]["name"])){
					newStandardsArray[groupCount]["data"].push(standardsArray[standardCount]);
				}
				if(!newStandardsArray[groupCount]["description"] && newStandardsArray[groupCount]["data"].length){
					newStandardsArray[groupCount]["description"] =  newStandardsArray[groupCount]["data"][0]["ancestors"][1]["description"];
				}
			}
		}
		
		var options2 = {
				parent: standardsNavParent,
				data: newStandardsArray,
				simData: simData,
				search: function(names){
					showSearchedSimsWithStandards(names);
				},
				setSearched: function(isStandardSelected){
					setStandardSelection(isStandardSelected);
				}
		};
		window.sidenav2 = new SideNavigation(options2);
		sideNav2 = window.sidenav2;
		var sideNavButton2 = document.getElementsByClassName('sort-box-standard')[0];
		sideNavButton2.addEventListener('click',sideNav2.openSideNavScreen.bind(sideNav2),false);
		sideNavButton2.addEventListener('touchstart',doNothing,false);
		
		document.addEventListener('click',sideNav2.closeSideNavScreen.bind(sideNav2),false);
		document.addEventListener('touchstart',sideNav2.closeSideNavScreen.bind(sideNav2),false);
		
		//document.getElementsByClassName('search-icon')[0].addEventListener('click',expandSearch,false);
	
	}
	function getVersionErrorModal(simId,updateObject){
		var simVersionErrorModal = document.createElement('div');
		simVersionErrorModal.id = "simVersionErrorModal";
		var strVar="";
//		strVar += "<div id=\"simVersionErrorModal\">";
		strVar += "   <div class=\"tile-close-update\"><\/div>";
		strVar += "   <div class=\"error-container\">";
		strVar += "      <div class=\"alert\"><\/div>";
		strVar += "      <div class=\"error-text-container\">";
		if(updateObject=='sim'){
			strVar += "         <div class=\"error-header\">Update Required<\/div>";
		}else{
			strVar += "         <div class=\"error-header\">App Update Required<\/div>";
		}		
		strVar += "         <div class=\"error-description\" style=\"";
//		strVar += "            \">A new version of "+(e.currentTarget.id || e.target.parentElement.id)+" is available!<\/div>";
		if(updateObject=='sim'){
			strVar += "            \">A new version of "+simId+" is available!<\/div>";
		}else{
			strVar += "            \">"+simId+" is not supported in this version of app!<\/div>";
		}		
		strVar += "      <\/div>";
		strVar += "      <div class=\"error-buttoncontainer\">";
		strVar += "         <div class=\"error-button\" id=\"update\">Update<\/div>";
		strVar += "      <\/div>";
		strVar += "   <\/div>";
//		strVar += "<\/div>";
		simVersionErrorModal.innerHTML = strVar;
		var simTile = document.getElementById(simId);
		simTile.parentNode.appendChild(simVersionErrorModal);
	
		var simClass = simTile.parentElement.classList[1];
		
		$('.'+simClass+' .tile-close-update').off('click').on('click', function(){
			$('.'+simClass+' #simVersionErrorModal').addClass('hide');
        });	
		$('.'+simClass+' #update').off('click').on('click', function(){
        	updateSim(simId,updateObject);
        });
      
	}
	function showSimUpdate(simId){		
		var updateObject = '';
		for(var simCount = 0; simCount<simUpdateData.length; simCount++){
			if(simId == simUpdateData[simCount].name){
				if(simUpdateData[simCount].allsparkSupport==402){
					updateObject = 'sim';
				}else if(simUpdateData[simCount].allsparkSupport==404){
					updateObject = 'app';
				}
				break;
			}
		}
		if(document.getElementById(simId).parentElement.lastChild.id=='simVersionErrorModal'){
			document.getElementById(simId).parentElement.lastChild.classList.remove('hide');
		}
		else{
			getVersionErrorModal(simId, updateObject);
		}
	}

	function updateSim(simId,updateObject){					//update Simulation
		if(updateObject=='sim'){
			deleteSim(simId,true);														//delete Simulation
//			simUpdateData.forEach(function ( obj,index ) {
//				if(simId==obj.name){
//					simUpdateData[index].allsparkSupport=200;				
//				}
//			});
			localStorage.setItem('simUpdateData',JSON.stringify(simUpdateData));			
			downloadSim(simId);	
		}else if(updateObject=='app'){					//update App
//			alert('App is to be updated');
			window.readerAppHelper.ClearDirectory("allspark");
        	window.localStorage.removeItem("allspark");
        	window.localStorage.removeItem("simUpdateData");
        	var platform = device.platform.toLocaleLowerCase();
        	if(platform.match(/(iPad|iPhone|iPod|iOS)/gi)) platform = 'ios';
            if(platform.match(/(droid)/gi)) platform = 'android';
        	window.open(encodeURI(APP_DOWNLOAD_URL[platform]), '_system');
        	navigator.app.exitApp();            
		}
	}
	function openSim(id){

		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			if(id == simData["simulations"][simCount].name){
				if (window.analytics) {
					window.analytics.trackView(id);
				}
				
				readerAppHelper.addADSEvents('FBS_SIMULATION',{
		            //action_name:'FBS_SIMULATION',
		            artifactID: simData["simulations"][simCount].artifactID,
		            memberID: JSON.parse(localStorage.AuthUserInfo).response.id,
		            adsVisitorID: ''
		        });
				
				if(simData["simulations"][simCount].simulationUrl == ""){
					
				}
				else{
					if(simData["simulations"][simCount].simulationUrl.match(/window.match_url/i)){
						var refUrl = simData["simulations"][simCount].simulationUrl;
						window.open(refUrl, '_blank', 'location=no,zoom=no,enableViewportScale=no');
					}
					else {
						var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, simURL = simData["simulations"][simCount].simulationUrl,
						simName = simURL.split('/')[0];
						//var refUrl = "http://interactives.ck12.org/simulations/physics/" + simURL, uri = encodeURI(refUrl) + '/js/CoverScene.js';
						var refUrl = window.SIM_OPN_SRV+"/simulations/physics/" + simName + '.zip', uri = encodeURI(refUrl),
						fileURLzip = fileURL + simName + '.zip', fileURLfolder = fileURL, fileURLsim = fileURL + simName + '/app/index.html';
						
						// To open sim offline
						if(window.localStorage.getItem(simName)){
//							if(e.target.parentElement.getElementsByClassName('tile-download')[0].classList.contains('update-available')){
//								alert('This version of simulation is not supported, kindly update');	
//							}else{
								//window.open(fileURLsim, '_blank', 'location=no,zoom=no,enableViewportScale=no');
								var fileUrl = fileURLsim+"?referrer=ck12Launcher&Downloaded&loc=app&backUrl=" +launcherOnlyURL;
								var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
								if(iOS==true){
									window.location.href = fileUrl;
								}else{
									window.location.href = fileUrl;
//									window.open(fileUrl, '_blank', 'location=no,zoom=no,enableViewportScale=no');
									//document.getElementsByClassName("iframe-parent-sim")[0].classList.remove("hide");
									//document.getElementsByClassName('instruction-video-frame-sim')[0].setAttribute("src",fileUrl);	
								
								}
//								window.location.href = fileURLsim+"?referrer=ck12Launcher&backUrl=" +launcherOnlyURL;
//							}
							
						}
						else if(checkDeviceConnectivity()){
							// To open the sim online
							var fileUrl = window.SIM_OPN_SRV+"/simulations/physics/" + simURL+"?referrer=ck12Launcher&loc=app&backUrl=" +launcherOnlyURL;
							var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
							if(iOS==true){
								window.location.href = fileUrl;
							}else{
								if(/Chromebook/.test(navigator.userAgent)){
									window.open(fileUrl, '_self', 'location=no,zoom=no,enableViewportScale=no');
									//window.location.href = fileUrl;
								}else{
									document.getElementsByClassName("iframe-parent-sim")[0].classList.remove("hide");
									document.getElementsByClassName('instruction-video-frame-sim')[0].setAttribute("src",fileUrl);
								}
								
							};
							//window.location.href = "http://simtest.ck12.org/simulations/repository/"+simData["simulations"][simCount].simulationUrl+"?referrer=ck12Launcher&backUrl="+window.location.href+"&artifactID=1234";
							if(simData["simulations"][simCount].simulationUrl.match(/window.match_url/i)){
								window.location.href = simData["simulations"][simCount].simulationUrl;
							}
							break;
						}else {
							showErrorMessage();
						};
					}
					break;
				}
		   }
		}
	
	}

	document.addEventListener('backbutton', function(){
		if(!document.getElementsByClassName("iframe-parent-sim")[0].classList.contains("hide")){
			
			document.getElementsByClassName('instruction-video-frame-sim')[0].setAttribute("src","");	
			document.getElementsByClassName("iframe-parent-sim")[0].classList.add("hide");
			
		}else{
			navigator.app.exitApp();
		}
	
		
		});
	
	function downloadAllspark(){
		var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, refUrl = window.SIM_DWL_SRV+"/simulations/common/allspark/1.0.8.zip", uri = encodeURI(refUrl),
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
																document.getElementById("loadingOverlay").classList.add("hide");
																window.localStorage.setItem('allspark','true');
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
			}
	
	function downloadSim(simId){

		  if(checkDeviceConnectivity()){
			  document.getElementById("loadingOverlay").classList.remove("hide");
				if(!window.localStorage.getItem('allspark')) downloadAllspark();

				/*if(!window.localStorage.getItem('allspark'))
					{	for(var temp=1;temp<2;temp--)
						{	if(window.localStorage.getItem('allspark'))
							break;
						}
					}*/
				for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
					var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, simURL = simData["simulations"][simCount].simulationUrl,
					simName = simURL.split('/')[0];
					//var refUrl = "http://interactives.ck12.org/simulations/physics/" + simURL, uri = encodeURI(refUrl) + '/js/CoverScene.js';
					var refUrl = window.SIM_DWL_SRV+"/simulations/physics/" + simName + '.zip', uri = encodeURI(refUrl),
					fileURLzip = fileURL + simName + '.zip', fileURLfolder = fileURL, fileURLsim = fileURL + simName + '/app/index.html';	
					
					if(simId == simData["simulations"][simCount].name){
						
						/*else{*/
							if(window.localStorage.getItem(simName)){
								console.log("already there");
								document.getElementById("loadingOverlay").classList.add("hide");
						/*		var refUrl = simData["simulations"][simCount].simulationUrl;
								window.open(refUrl, '_blank', 'location=no,zoom=no,enableViewportScale=no');*/
							}
							else {
							
									function downloadFile(){	
										
										readerAppHelper.addADSEvents('FBS_SIMULATION_DOWNLOAD',{
							                //action_name:'FBS_SIMULATION_DOWNLOAD',
							                memberID: JSON.parse(localStorage.AuthUserInfo).response.id,
							                artifactID:simData["simulations"][simCount].artifactID
							            });
										
										var fileTransfer = new FileTransfer();
										fileTransfer.download(uri,fileURLzip,function(entry) {
												console.log("download complete: " + entry.toURL());
												
												zip.unzip(fileURLzip, fileURLfolder, function(res){
													zip.unzip(fileURL+simName+'/app.zip', fileURLfolder+simName, function(res){
														zip.unzip(fileURL+simName+'/app/css.zip', fileURLfolder+simName+'/app', function(res){
															console.log("download complete-a");
															zip.unzip(fileURL+simName+'/app/js.zip', fileURLfolder+simName+'/app', function(res){
																console.log("download complete-b");
																zip.unzip(fileURL+simName+'/app/json.zip', fileURLfolder+simName+'/app', function(res){
																	console.log("download complete-c");
																	zip.unzip(fileURL+simName+'/app/assets.zip', fileURLfolder+simName+'/app', function(res){
																		window.localStorage.setItem(simName,'true');
																		console.log("download complete-d")
																		/** PLEASE COPY THIS TO IOS***/
																			
																			document.getElementById("loadingOverlay").classList.add("hide");
																			
//																		simUpdateData.forEach(function ( obj,index ) {
//																			if(simId==obj.name){
//																				simUpdateData[index].allsparkSupport=true;				
//																			}
//																		})
//																		localStorage.setItem('simUpdateData',JSON.stringify(simUpdateData));
																		
																		/** PLEASE COPY THIS TO IOS***/
//																		e.target.classList.add("downloaded");
//																		document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.remove('update-available');
																		
																		document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.add("downloaded");
																		var simClass = document.getElementById(simId).parentElement.classList[1];
																		$('.'+simClass+' #simVersionErrorModal').addClass('hide');
																		checkAllsparkSupport(simData["simulations"][simCount],simCount);
																		
																		downloadedSims.push(simName);
																		checkAnysimDownloaded();
																		zip.unzip(fileURL+simName+'/res.zip', fileURLfolder+simName, function(res){
																			console.log("download complete-e");
																			cleanZipfile(simName);
																			cleanZipfile(simName+'/app');
																			cleanZipfile(simName+'/res');
																			cleanZipfile(simName+'/app/assets');
																			cleanZipfile(simName+'/app/css');
																			cleanZipfile(simName+'/app/js');
																			cleanZipfile(simName+'/app/json');
																		});
																		//window.open(fileURLsim, '_blank', 'location=no,zoom=no,enableViewportScale=no');
																		//window.location.href = fileURLsim;
																	});
																});
															});
														});
														
													
														
													});
												
												});
												
											},
											function(error) {
												console.log("download error source " + error.source);
												console.log("download error target " + error.target);
												console.log("upload error code" + error.code);
												var refUrl = window.SIM_DWL_SRV+"/simulations/physics/" + simURL;
												var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
												document.getElementById("loadingOverlay").classList.add("hide");
												/*	if(iOS==true){
														window.location.href = refUrl;
													}else{
														window.open(refUrl, '_blank', 'location=no,zoom=no,enableViewportScale=no');	
													};*/
												
											},
											false,
											{
												headers: {
													"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
												}
											}
										);
									}
									downloadFile();
									
								
							}
						/*}*/
						break;
					}
				}
				
			
		  }else{
			  showErrorMessage();
		  }
	

	}
	function cleanZipfile(path){
		 var path = path.toString();
	        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
	        function fail(evt) {
	            alert("FILE SYSTEM FAILURE");
	        }
	        function onFileSystemSuccess(fileSystem) {
	            fileSystem.root.getFile(
	            		"Android/data/org.ck12.simulations/files/"+path+".zip",
	                {create : true, exclusive : false},
	                function(entry) {
	                entry.remove(function() {
//	                	window.localStorage.removeItem(path);
	                	console.log("Vipin Bhai Chaa Gaye")
	                }, fail);
	            }, fail);
	        }
	    }
	function checkAllsparkSupport(obj,simCount){
		var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory, simURL = obj.simulationUrl,
				simName = simURL.split('/')[0],
				fileURLsimPackage = fileURL + simName + '/package.json';
			ajax.loadURL(fileURLsimPackage,{
				"callback":function(packageInfo){
					if(packageInfo){
						packageInfo = JSON.parse(packageInfo);
						var minSupportedAppVersion =  packageInfo.minAppVersion || "1";
						var currentSimVersion = packageInfo.version || "1";
						currentSimVersion = currentSimVersion.split('.')[0];
						
						console.log(packageInfo);
						if(currentAppVersion>=minSupportedAppVersion){
							if(currentSimVersion==obj.simVersionSupported){
								allsparkSupport = 200;							//everything fine
							}else{
								allsparkSupport = 402;							//sim update required				
							}
						}else{
							allsparkSupport = 404;								//app update required
						}
						simUpdateData[simCount].allsparkSupport = allsparkSupport;
						localStorage.setItem('simUpdateData',JSON.stringify(simUpdateData));
						simUpdateData = JSON.parse(localStorage.getItem('simUpdateData'));;
//						checkForUpdates();
						var cardDownload = document.getElementsByClassName('tile-download')[simCount];
						if(simUpdateData[simCount].allsparkSupport == 404){
							cardDownload.classList.add("update-available");
						}else if(simUpdateData[simCount].allsparkSupport == 402){
							cardDownload.classList.add("update-available");
						}else if(simUpdateData[simCount].allsparkSupport == 402){
							cardDownload.classList.remove("update-available");
						}
					}
				}
			});
	}
	/*function gotRemoveFileEntry(fileEntry){
	    console.log(fileEntry);
	    fileEntry.remove(success, fail);
	}
	function success(entry) {
	    console.log("Removal succeeded");
	}

	function fail(error) {
	    console.log("Error removing file: " + error.code);
	}*/
	
	/*Code for delete */
	  function ClearDirectory(path) {
		 var path = path.toString();
		 /*vipin*/ window.localStorage.removeItem(path)
	        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onFileSystemSuccess, fail);
	        function fail(evt) {
	            alert("FILE SYSTEM FAILURE");
	        }
	        function onFileSystemSuccess(fileSystem) {
	            fileSystem.root.getDirectory(
	            		"Android/data/org.ck12.simulations/files/"+ path,
	                {create : true, exclusive : false},
	                function(entry) {
	                entry.removeRecursively(function() {
	                    console.log("Remove Recursively Succeeded");
	                }, fail);
	            }, fail);
	        }
	    }
	  


	  function checkAnysimDownloaded(){
		  anySimDownloaded = false;
		  var offlineTab  = document.getElementById('offlineTab');  /**Code for delete **/ ;
		  for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			  var cardDownload = document.getElementsByClassName('tile-download')[simCount];
			  /*vipin*/
			  var simURL = simData["simulations"][simCount].simulationUrl,
				simName = simURL.split('/')[0];
			  if(cardDownload.classList.contains("downloaded")/*vipin*/ || window.localStorage.getItem(simName)){
				  anySimDownloaded=true;  
			  }
		  }
		  if(anySimDownloaded){
//			  if(offlineTab.classList.contains('hideOffline'))offlineTab.classList.remove('opacityNone');
			  document.getElementsByClassName('toggle-button-container')[0].classList.remove('opacityZero');
			  if(document.getElementsByClassName('toggle-button-container')[0].classList.contains('hideOffline'))document.getElementsByClassName('toggle-button-container')[0].classList.remove('hideOffline');
		  }else{
			  if(offlineTab.classList.contains('toggle-button-selected')){
            	  offlineTab.classList.remove('toggle-button-selected');
            	  //offlineTab.classList.add('inactive');
            	  downloadedMode = false;
              }
			  /*vipin*/
			 //  	ClearDirectory("1.0.8");
			 //  	ClearDirectory("allspark");
				// cleanZipfile("1.0.8");
				// window.localStorage.removeItem('allspark');
			  document.getElementsByClassName('toggle-button-container')[0].classList.add('hideOffline');
			  showAll();
		  }
	  }
	  
	  function deleteSim(simId,offline){
		  var simUrlId = simId.toLowerCase().replace(/ /g,'-').replace(/'/g,"");
//		  var sssurl = e.target.parentElement.id.toLowerCase() + "/app/index.html";
		  var sssurl = simUrlId + "/app/index.html";
		  var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory,
//		      simURL = e.target.parentElement.id.toLowerCase() + "/app/index.html",
			  simURL = simUrlId + "/app/index.html",
		      simName = simURL.split('/')[0];
		  //var refUrl = "http://interactives.ck12.org/simulations/physics/" + simURL, uri = encodeURI(refUrl) + '/js/CoverScene.js';
		  var refUrl = window.SIM_DWL_SRV + "/simulations/physics/" + simName + '.zip',
		      uri = encodeURI(refUrl),
		      fileURLzip = fileURL + simName + '.zip',
		      fileURLfolder = fileURL,
		      fileURLsim = fileURL + simName + '/app/index.html';
		  //e.stopPropagation();

		  for (var simCount = 0; simCount < simData["simulations"].length; simCount++) {
		      var fileURL = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ? cordova.file.dataDirectory : cordova.file.externalDataDirectory,
		          simURL = simData["simulations"][simCount].simulationUrl,
		          simName = simURL.split('/')[0];
		      //var refUrl = "http://interactives.ck12.org/simulations/physics/" + simURL, uri = encodeURI(refUrl) + '/js/CoverScene.js';
		      var refUrl = window.SIM_DWL_SRV + "/simulations/physics/" + simName + '.zip',
		          uri = encodeURI(refUrl),
		          fileURLzip = fileURL + simName,
		          fileURLfolder = fileURL,
		          fileURLsim = fileURL + simName + '/app/index.html';

		      if (simId == simData["simulations"][simCount].name) {
		    	  
		    	  readerAppHelper.addADSEvents('FBS_SIMULATION_DELETE',{
		                memberID: JSON.parse(localStorage.AuthUserInfo).response.id,
		                artifactID:simData["simulations"][simCount].artifactID
		    	  });
		    	  
		          /*** code to delete Downloaded sim from view***/
//		          var simNameCheck = e.target.parentElement.id;
		          ClearDirectory(simName);
//		          cleanZipfile(simName);
		          window.localStorage.removeItem(simName);
//		          e.target.previousSibling.classList.remove("downloaded");
		          document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.remove("downloaded");
		          document.getElementById(simId).getElementsByClassName('tile-download')[0].classList.remove('update-available');
		          var index = downloadedSims.indexOf(simName);
		          if (index > -1) {
		              downloadedSims.splice(index, 1);
		          }
		          if (!offline) {
//		              hideDeletedSim(simNameCheck);
		        	  hideDeletedSim(simId);
		              checkAnysimDownloaded();
		          }
		          if(document.getElementById('deletePermissionView'))
		          	document.getElementById('deletePermissionView').classList.add('hide');
		      }
		  }
	  }

	  /*Code for delete */
	var item , searchTerm  ;
	function searchItem(e){
	    prevItem = "",nameOfConcepts=[],nameOfStandards=[];
    	hideAll();

		notFound=true;
		
    	sideNav.unselectAllCheckBox();
		if(sideNav2)sideNav2.unselectAllCheckBox();
		
    	searchInSimulations();
    	searchInConcepts();
    	searchInKeywords();
    	
		
    	item = searchClick.value.toLowerCase();
		if(prevItem === item){}else{
	    	if( e.keyCode < 91 && e.keyCode > 47 ){
	    		setTimeout(function(){
	        		if(prevItem === item){}else{
	        			 /*dexterjs.logEvent("FBS_SIMULATION_SEARCH", {
	     	        			searchTerm : item
	     	                });*/
	        			 readerAppHelper.addADSEvents('FBS_SIMULATION_SEARCH',{
	        	              //action_name:'FBS_SIMULATION_SEARCH',
	        	              searchTerm : item
	        	          });
	        		}
	        		 prevItem = item ;
	        	},1000);
	    	}
		}
		if(notFound){
			document.getElementsByClassName('no-match-found')[0].classList.remove('hide');
		}
		if(searchClick.value==''){
			document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
		}
		else if(window.innerWidth>900){
			document.getElementsByClassName('clear-item')[0].classList.remove('hide-back');
		}
	}
	
	var lastScrollValue = 0;
	function scrollSims(e){
		e.preventDefault();
		e.stopPropagation();
		var sortSection = document.getElementsByClassName('filter-button')[0];
		
		/*if(window.scrollY > lastScrollValue && window.scrollY > 71){
			document.getElementsByClassName('filter-button')[0].classList.add('hide');
			document.getElementsByClassName('filter-button')[1].classList.add('hide');
		}
		else{
			document.getElementsByClassName('filter-button')[0].remove('hide');
			document.getElementsByClassName('filter-button')[1].remove('hide');
		}*/
		
		lastScrollValue = window.scrollY;
	}
	
	var notFound=true;
	
	function searchInSimulations(){
		var item = searchClick.value.toLowerCase();
		item = item.trim();
		var itemReg = new RegExp(item,"i");
		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			var string = simData["simulations"][simCount].name.toLowerCase();
			var result = string.match(itemReg);
//			if(result && result.input == simData["simulations"][simCount].name.toLowerCase()){
//				showSearched(simCount);
//				notFound=false;
//			}
			if(result && result.input == simData["simulations"][simCount].name.toLowerCase()){				// updated for search in offline mode
				if(downloadedMode){
					searchInDownloaded(simCount);
				}else{
				showSearched(simCount);
				notFound=false;
			}
		}
	}
	}
	
	function searchInConcepts(){
		document.getElementsByClassName('no-match-found')[0].classList.add('hide');
		var item = searchClick.value.toLowerCase();
		item = item.trim();
		var itemReg = new RegExp(item,"i");
		for(var eidsConceptCount = 0; eidsConceptCount<eidsData["concepts"].length; eidsConceptCount++){
			var string = eidsData["concepts"][eidsConceptCount].name.toLowerCase();
			var result = string.match(itemReg);
			if(result && result.input == eidsData["concepts"][eidsConceptCount].name.toLowerCase()){
				for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
					for(var simConceptCount = 0; simConceptCount<simData["simulations"][simCount].concepts.length; simConceptCount++){
						if(eidsData["concepts"][eidsConceptCount].encodedID == simData["simulations"][simCount].concepts[simConceptCount]){
							if(downloadedMode){											// updated for search in offline mode
								searchInDownloaded(simCount);
							}else{
							showSearched(simCount);
							notFound=false;
						}
//							showSearched(simCount);
//							notFound=false;
						}
						
					}
				}
			}
		}
//		if(notFound){
//			document.getElementsByClassName('no-match-found')[0].classList.remove('hide');
//		}
	}
	
	function searchInKeywords(){
		
		var item = searchClick.value.toLowerCase();
			item = item.trim();
		var itemReg = new RegExp(item,"i");
		
		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			for(var simKeywordCount = 0; simKeywordCount<simData["simulations"][simCount].keywords.length; simKeywordCount++){
				var string = simData["simulations"][simCount].keywords[simKeywordCount].toLowerCase();
				var result = string.match(itemReg);
				if(result && result.input == simData["simulations"][simCount].keywords[simKeywordCount].toLowerCase()){
					if(downloadedMode){										// updated for search in offline mode
						searchInDownloaded(simCount);
					}else{
					showSearched(simCount);
					notFound=false;
				}
//					showSearched(simCount);
//					notFound=false;
				}				
			}
		}
//		if(notFound){
//			document.getElementsByClassName('no-match-found')[0].classList.remove('hide');
//		}
	}
	
	function searchInDownloaded(simCount){
		for(var i in downloadedSims){
			if(simData["simulations"][simCount].name.toLowerCase().replace(/ /g,'-').replace(/'/g,"")===downloadedSims[i]){
				showSearched(simCount);
				notFound=false;
				
			}
		}
	}
	
	var simSelected=false,isConceptSelected=false,isStandardSelected=false;
	
	function setConceptSelection(isSelected){
		isConceptSelected = isSelected;
		simSelected = isConceptSelected || isStandardSelected;
		if(!simSelected){
			
			if(downloadedMode){
				//document.getElementById('offlineTab').classList.add('toggle-button-selected');
				document.getElementById('offlineTab').classList.remove('toggle-button-selected');
				downloadedMode = false;
//				showOfflineSims();
			}else{
				showAll();
				nameOfConcepts=[];
				document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
			}
			
//			showAll();
//			nameOfConcepts=[];
//			document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
		}
		else if(window.innerWidth>900){
			document.getElementsByClassName('clear-item')[0].classList.remove('hide-back');
		}
	document.getElementsByClassName('no-match-found')[0].classList.add('hide');
	}

	function setStandardSelection(isSelected){
		isStandardSelected = isSelected;
		simSelected = isConceptSelected || isStandardSelected;
		if(!simSelected){
			if(downloadedMode){
				//document.getElementById('offlineTab').classList.add('toggle-button-selected');
				document.getElementById('offlineTab').classList.remove('toggle-button-selected');
				downloadedMode = false;
//				showOfflineSims();
				showAll();
			}else{
			showAll();
			nameOfStandards=[];
			document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
		}
//			showAll();
//			nameOfStandards=[];
//			document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
		}
		else if(window.innerWidth>900){
			document.getElementsByClassName('clear-item')[0].classList.remove('hide-back');
		}
		document.getElementsByClassName('no-match-found')[0].classList.add('hide');
	}
	
	function showSearchedSimsWithConcepts(names){
		nameOfConcepts=names;
    	if(nameOfConcepts.length==0 && nameOfStandards.length==0){
    		showAll();
    	}
    	else{
    		hideAll();
    		searchSimsWithConcepts(nameOfConcepts);
    	}
    	searchClick.value = "";
    	searchSimsWithStandards(nameOfStandards);
	}

	function showSearchedSimsWithStandards(names){
		nameOfStandards=names;
    	if(nameOfStandards.length==0 && nameOfConcepts.length==0){
    		showAll();
    	}
    	else{
    		hideAll();
    		searchSimsWithStandards(nameOfStandards);
    	}
    	searchClick.value = "";
    	searchSimsWithConcepts(nameOfConcepts);
	}

	function searchSimsWithConcepts(names){
		for(var i=0; i<names.length; i++){
    		for(var eidsConceptCount = 0; eidsConceptCount<eidsData["concepts"].length; eidsConceptCount++){
    			var conceptName = eidsData["concepts"][eidsConceptCount].name.toLowerCase();
    			if(conceptName == names[i]){
    				for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
    					for(var simConceptCount = 0; simConceptCount<simData["simulations"][simCount].concepts.length; simConceptCount++){
    						if(eidsData["concepts"][eidsConceptCount].encodedID == simData["simulations"][simCount].concepts[simConceptCount]){
    							showSearched(simCount,true);
    						}
    					}
    				}
    			}
    		}
    	}
		if(downloadedMode){
			setTimeout(function(){
				var notFoundF = true;
				for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
					if(!document.getElementsByClassName('thumbnail-view')[simCount].classList.contains('hide-back')){
						document.getElementsByClassName('no-match-found')[0].classList.add('hide');
						notFoundF = false;
						break;
					}else{
						 notFoundF = true;
					}				
				}
				if(notFoundF)document.getElementsByClassName('no-match-found')[0].classList.remove('hide');
			},500);
		}		
	}
	
	function searchSimsWithStandards(names){
		var conceptNames = [], stdId;
		for(var standardCount=0; standardCount<names.length; standardCount++){
			for(var key in stdData.response.standards) {
				var standardId = stdData.response.standards[key].label.toLowerCase();
	    		if(standardId == names[standardCount].toLowerCase()){
	    			stdId = stdData.response.standards[key].sid.toLowerCase();
				}
			}
			
			for(var key in stdData.response.concepts) {
				var standardId = stdData.response.concepts[key].standards;
				
				for(var i=0; i<standardId.length; i++){
		    		if(standardId[i].toLowerCase() == stdId){
		    			var conceptName = stdData.response.concepts[key].concept.name.toLowerCase();
		    			conceptNames.push(conceptName);
					}
				}
			}
    	}
		searchSimsWithConcepts(conceptNames);
	}
	
	/*function searchSimsWithStandards(names){
		var conceptNames = [];
		for(var standardCount=0; standardCount<names.length; standardCount++){
			for(var key in stdData.response.concepts) {
				var standardId = stdData.response.concepts[key].standards;
				
				for(var i=0; i<standardId.length; i++){
		    		if(standardId[i].toLowerCase() == names[standardCount].toLowerCase()){
		    			var conceptName = stdData.response.concepts[key].concept.name.toLowerCase();
		    			conceptNames.push(conceptName);
					}
				}
			}
    	}
		searchSimsWithConcepts(conceptNames);
	}*/
	
	function hideAll(){
		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			var card = document.getElementsByClassName('thumbnail-view')[simCount];
			card.classList.add('hide-back');
		}
	}
	/*** code to delete Downloaded sim from view***/
	function hideDeletedSim(simName){
		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			if(simName == simData["simulations"][simCount].name){
				var card = document.getElementsByClassName('thumbnail-view')[simCount];
				card.classList.add('hide-back');
			}
		}
	}
	/*** code to delete Downloaded sim from view***/
	 /**Code for delete **/
	function showAll(){
		for(var simCount = 0; simCount<simData["simulations"].length; simCount++){
			var card = document.getElementsByClassName('thumbnail-view')[simCount],
			cardDelete = document.getElementsByClassName('tile-delete')[simCount],
			cardDownload = document.getElementsByClassName('tile-download')[simCount];
			card.classList.remove('hide-back');
			cardDelete.classList.add('hide');
			cardDownload.classList.remove('hide');
		}
	}
	 /**Code for delete **/
	function showSearched(simCount,searchWithConceptF){
		if(searchWithConceptF){														// updated for concept search in offline mode
			if(downloadedMode){
				for(var i in downloadedSims){
					if(simData["simulations"][simCount].name.toLowerCase().replace(/ /g,'-').replace(/'/g,"")===downloadedSims[i]){
						var card = document.getElementsByClassName('thumbnail-view')[simCount];
						card.classList.remove('hide-back');
						
					}else{
					}
				}
			}else{
				var card = document.getElementsByClassName('thumbnail-view')[simCount];
				card.classList.remove('hide-back');
			}
		}else{
			var card = document.getElementsByClassName('thumbnail-view')[simCount];
			card.classList.remove('hide-back');
		}
	
//		var card = document.getElementsByClassName('thumbnail-view')[simCount];
//		card.classList.remove('hide-back');
	}
	
	function expandSearch(e){
		e.stopPropagation();
		//searchClick.classList.add('search-expand');
		document.getElementsByClassName('search-field')[0].classList.add('open-search');
		document.getElementsByClassName('search-icon')[0].classList.add('hide');
		//searchClick.click();
		setTimeout(function(){
			searchClick.focus();
		},500);
	}
	
	function collapseSearch(e){
		e.stopPropagation();
	//	document.getElementsByTagName("body")[0].style.overflow="auto";
		if(lastSimStdShowed){
			lastSimStdShowed.classList.add('hide');
			lastSimStd.style.fontWeight = 'normal';

		}
		if(!e.target.classList.contains("nav-bottom") && !e.target.classList.contains("filter-menu-wrapper") ){
			document.getElementsByClassName("filter-main-wrapper")[0].classList.add("go-left");	
		}
		
		
//		if(document.getElementById("UserProfileView").classList.contains("hide")){
		if(!(e.target.classList.contains("signout") || e.target.classList.contains('user-profile-screen') || e.target.classList.contains('user-profile-container')|| e.target.classList.contains('email')|| e.target.classList.contains('name')))
			document.querySelector("#UserProfileView").classList.add('hide')
//		 }
	}
	
	/*document.ontouchmove = function(e){
		e.preventDefault();
	}*/
	
});;define('SideNavigation',['ajax'],function(ajax){
	
	/**
	 * @method createSideNav
	 * @param {string} side for creation (left or right)
	 * @param {number} number if items in nav
	 */
	
	var  conceptsEidArray , standardsIdArray = [] , standardsIdObject ;
	
	  ajax.loadURL('file:///data/data/org.ck12.simulations/files/eids.json',{
			"callback" : createConceptList
			
		});
	  ajax.loadURL('file:///data/data/org.ck12.simulations/files/standardsData.json',{
			"callback" : generateStandardsList
		});
		
	function createConceptList(responseText){
	    	
	    	conceptResponse =  JSON.parse(responseText) ;
	    	conceptsEidArray = conceptResponse.concepts ;
	    }
	
	function generateStandardsList(responseText){
    	
    	standardsResponse =  JSON.parse(responseText) ;
    	standardsIdObject = standardsResponse.response.standards ;
    	for (var key in standardsIdObject ){
    		standardsIdArray.push(key) ; 
    	}
        }
	    
	
	function SideNavigation(options) {
		this.sideNavScreen;
		this.isNav=false;
		this.isChecked = false;
		this.parent = options.parent;
		this.data = options.data;
		this.simData = options.simData;
		this.sortedData = [];
		this.search = options.search;
		this.setSearched = options.setSearched;
		this.newNames=[];
		this.oldNames=[];
		this.groupBox=[];
		
		this.dataEidArray = this.data;
	    this.dataGroup = false ;
		
    	this.sideNavScreen = document.createElement("div");
    	this.sideNavScreen.classList.add('side-nav-screen');
//    	this.sideNavScreen.classList.add('go-left');
		this.parent.appendChild(this.sideNavScreen);
		
		this.sideNavScreen.addEventListener('click',this.doNothing,false);
		this.sideNavScreen.addEventListener('touchstart',this.doNothing,false);
		
		this.sortDataElements();
		this.createDataElements();
		
    };
    
    SideNavigation.prototype.sortDataElements = function() {
    	this.sortedData = this.data;
	    //this.sortedData.sort();
    }
    
    SideNavigation.prototype.createDataElements = function() {
		var sideNavHeading = document.createElement("div");
		sideNavHeading.classList.add('side-nav-heading');
		this.sideNavScreen.appendChild(sideNavHeading);
		
		this.navBottom = document.getElementsByClassName("nav-bottom")[0];
		
		/*document.getElementsByClassName("filter-main-wrapper")[0].appendChild(this.navBottom);*/
		/*this.navBottom.innerHTML = "Clear Filter";*/
		
		/*this.navBottom.addEventListener('touch',this.deselectAll.bind(this),false);*/
		/*this.navBottom.classList.add('deselect');*/
		/*.addEventListener('click',this.deselectAll,false);*/
		var sideNavContent = document.createElement("div");
		sideNavContent.classList.add('side-nav-content');
		this.sideNavScreen.appendChild(sideNavContent);
		//sideNavContent.style.height = (window.innerHeight-220)+'px';
		
		for(var groupCount = 0; groupCount<this.data.length; groupCount++){
			if(this.data[groupCount]["data"].length){
				this.groupBox.push(this.groupBox+groupCount);
				this.groupBox[groupCount] = document.createElement("div");
				this.groupBox[groupCount].classList.add('group-box');
				this.groupBox[groupCount].classList.add('group-box'+groupCount);
				sideNavContent.appendChild(this.groupBox[groupCount]);
				
				var groupCheckBox = document.createElement("div");
				groupCheckBox.classList.add('ckeck-box');
				this.groupBox[groupCount].appendChild(groupCheckBox);
				groupCheckBox.isChecked = false;
				
				var groupName = document.createElement("div");
				groupName.classList.add('group-name');
				this.groupBox[groupCount].appendChild(groupName);
				groupName.innerHTML = this.data[groupCount]["description"] || this.data[groupCount]["name"];
				
				groupName.addEventListener('click',this.groupNameFn.bind(this),false);
				groupCheckBox.addEventListener('click',this.groupCheckBoxFn.bind(this),false);
				
				var groupContent = document.createElement("div");
				groupContent.classList.add('group-content');
				groupContent.classList.add('group-content'+groupCount);
				this.groupBox[groupCount].appendChild(groupContent);
				
				var groupElements = "";
				for(var conceptCount = 0; conceptCount<this.data[groupCount]["data"].length; conceptCount++){
					if(this.data[groupCount]["data"][conceptCount]["label"]){
						groupElements = groupElements + '<div class="concept-box concept-box'+groupCount+'-'+conceptCount+'"><div class="ckeck-box"></div><div class="concept-name" data="'+this.data[groupCount]["data"][conceptCount]["label"]+'">'+this.data[groupCount]["data"][conceptCount]["label"]+'</div></div>'
					}else{
						groupElements = groupElements + '<div class="concept-box concept-box'+groupCount+'-'+conceptCount+'"><div class="ckeck-box"></div><div class="concept-name" data="'+this.data[groupCount]["data"][conceptCount]+'">'+this.data[groupCount]["data"][conceptCount]+'</div></div>'
					}
				}
				groupContent.innerHTML = groupElements;
				var elements  = groupContent.getElementsByClassName('concept-box');
				for(var i=0;i<elements.length;i++){
					elements[i].addEventListener('click',this.conceptBoxFn.bind(this),false);
					elements[i].isChecked = false;
				}
				groupName.click();
			}
		}
		//this.parent.previousElementSibling.click();
    };
    
    SideNavigation.prototype.groupNameFn = function(e) {
    	e.stopPropagation();
    	if(e.currentTarget.isView){
    		e.currentTarget.isView = false;
    		e.currentTarget.nextSibling.classList.remove('group-collapse');
    		e.currentTarget.nextSibling.classList.remove('group-hide');
    	}
    	else{
    		e.currentTarget.isView = true;
    		e.currentTarget.nextSibling.classList.add('group-collapse');
    		e.currentTarget.nextSibling.classList.add('group-hide');
    	}
    	
    }
    
    SideNavigation.prototype.groupCheckBoxFn = function(e) {
    	var filter_Eid , filterID ;
    	e.stopPropagation();
    	if(e.currentTarget.nextSibling.isView){
    		e.currentTarget.nextSibling.click();
    	}
    	
    	/*for(var i = 0 ; i < this.dataEidArray.length ; i++){
            	if(this.dataEidArray[i].name == e.currentTarget.parentElement.childNodes[1].innerText){
            		 filter_Eid = this.dataEidArray[i].encodedID ;
            	}
            
        }*/
    	var listName = getNthParentOf(e.target,4);
    	if(listName.className == "concept-filter concept-filter-list"){
    		
    		for(var i = 0 ; i < conceptsEidArray.length ; i++){
            	if(conceptsEidArray[i].name == e.currentTarget.parentElement.childNodes[1].innerText){
            		 filter_Eid = conceptsEidArray[i].encodedID ;
            	}
            	}
    		
    		filterID = "context_eid" ;
    		
    	}else if(listName.className == "standard-filter standards-filter-list"){
    		for (var i = 0 ; i < standardsIdArray.length ; i++ ) {

    			if(standardsIdObject[standardsIdArray[i]].label == e.target.nextElementSibling.innerHTML ){
    				filter_Eid = standardsIdObject[standardsIdArray[i]].sid ;
    			}

    			}
    		filterID = "sid" ;
    	}
    	
    	if(e.currentTarget.isChecked){
    		this.dataGroup = false ;
    		e.currentTarget.isChecked = false;
    		e.currentTarget.classList.remove('checked');
    		
    		for(var conceptCount = 0; conceptCount<e.currentTarget.nextSibling.nextSibling.childNodes.length; conceptCount++){
    			var conceptBox = e.currentTarget.nextSibling.nextSibling.childNodes[conceptCount];
				conceptBox.childNodes[0].classList.add('checked');
				conceptBox.isChecked = true;
				conceptBox.childNodes[0].isChecked = true;
        		conceptBox.click();
    		}
    	}
    	else{
    		this.dataGroup = true; 
    		e.currentTarget.isChecked = true;
    		e.currentTarget.classList.add('checked');
    		
    		for(var conceptCount = 0; conceptCount<e.currentTarget.nextSibling.nextSibling.childNodes.length; conceptCount++){
    			var conceptBox = e.currentTarget.nextSibling.nextSibling.childNodes[conceptCount];
    			conceptBox.childNodes[0].classList.remove('checked');
    			conceptBox.isChecked = false;
    			conceptBox.childNodes[0].isChecked = false;
        		conceptBox.click();
    		}
    		
    		if(filterID == "context_eid"){
    			/*dexterjs.logEvent("FBS_SIMULATION_FILTER", {
                    context_eid : filter_Eid
                });*/
    			 readerAppHelper.addADSEvents('FBS_SIMULATION_FILTER',{
   	              //action_name:'FBS_SIMULATION_FILTER',
   	              context_eid : filter_Eid
   	          });
    		}else if(filterID = "sid"){
    			 readerAppHelper.addADSEvents('FBS_SIMULATION_FILTER_STANDARD',{
     	              //action_name:'FBS_SIMULATION_FILTER_STANDARD',
     	            sid : filter_Eid,
                   filterType:"standard"
     	          });
    		}
    		
    		//_dexterEventCheckBox(filter_Eid);
    		//_dexterEventCheckBox.apply(this,[filter_Eid]);
    	}
    	
    }
    
    SideNavigation.prototype.openSideNavScreen = function(e) {
    	e.stopPropagation();
    	var isFilter ;
    	var obj1 = e.currentTarget;	//.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1];
    	var obj2 = e.currentTarget;	//.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[1];
    	
    	if(obj1!=e.currentTarget && obj1.isNav){
    		document.getElementsByClassName('show-menu')[0].click();
    		obj1.isNav = false;
    	}
    	else if(obj2!=e.currentTarget && obj2.isNav){
    		document.getElementsByClassName('show-menu')[1].click();
    		obj2.isNav = false;
    	}
    	if(e.target.innerHTML.indexOf('Standards') > -1){
			isFilter = "standards" ;
		}else if(e.target.innerHTML.indexOf('Concepts') > -1){
			isFilter = "concept" ;
    	}
				 readerAppHelper.addADSEvents('FBS_SIMULATION_BROWSE_FILTER',{
	              //action_name:'FBS_SIMULATION_BROWSE_FILTER',
	             filterType : isFilter
	          });
//    	document.getElementsByClassName('sort-item')[0].style.backgroundColor = "#eee";
//		document.getElementsByClassName('sort-item')[1].style.backgroundColor = "#eee";
//		document.getElementsByClassName('sort-item')[0].style.boxShadow = "";
//		document.getElementsByClassName('sort-item')[1].style.boxShadow = "";
    	
		/*if(e.currentTarget.isNav){
    		this.sideNavScreen.classList.add('go-left');
    		e.currentTarget.isNav = false;
    		e.currentTarget.childNodes[3].classList.remove('rotate-show');
    	}
    	else{
    		this.sideNavScreen.classList.remove('go-left');
    		e.currentTarget.isNav = true;
    		e.currentTarget.childNodes[3].classList.add('rotate-show');

    		e.currentTarget.parentNode.parentNode.style.backgroundColor = "white";
    		e.currentTarget.parentNode.parentNode.style.boxShadow = "2px 0px 2px rgba(0, 0, 0, 0.2)";
    		
    		if(e.target.innerHTML.indexOf('Standards') > -1){
    			isFilter = "standards" ;
    		}else if(e.target.innerHTML.indexOf('Concepts') > -1){
    			isFilter = "concept" ;
        	}
    				 readerAppHelper.addADSEvents({
   	              action_name:'FBS_SIMULATION_BROWSE_FILTER',
   	             filterType : isFilter
   	          });
    		/*dexterjs.logEvent("FBS_SIMULATION_BROWSE_FILTER", {
    			
    			filterType : isFilter
              
            });
    	}*/
    };
    
    SideNavigation.prototype.closeSideNavScreen = function(e) {
    	e.stopPropagation();
    	
    	var obj1 = document.getElementsByClassName('show-menu')[0].parentNode;
    	var obj2 = document.getElementsByClassName('show-menu')[1].parentNode;
    	
    	if(obj1.isNav){
    		obj1.click();
    		obj1.isNav = false;
    		obj1.childNodes[3].classList.remove('rotate-show');
    	}
    	else if(obj2.isNav){
    		obj2.click();
    		obj2.isNav = false;
    		obj2.childNodes[3].classList.remove('rotate-show');
    	}
    };
    
    SideNavigation.prototype.doNothing = function (e){
		e.stopPropagation();
	};

    SideNavigation.prototype.deselectAll = function(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	this.unselectAllCheckBox();
    	//this.showAll();
    	//document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
    	this.setSearched(false);
    	this.search(this.newNames);
    };

    SideNavigation.prototype.showAll = function(e) {
		for(var simCount = 0; simCount<this.simData["simulations"].length; simCount++){
			var card = document.getElementsByClassName('thumbnail-view')[simCount];
			card.classList.remove('hide-back');
		}
	}
    
    SideNavigation.prototype.unselectAllCheckBox = function(e) {
    	for(var groupCount = 0; groupCount<this.data.length; groupCount++){
    		if(typeof this.groupBox[groupCount] != 'object' || this.groupBox[groupCount].childNodes == undefined)
				continue;

			this.groupBox[groupCount].childNodes[0].classList.remove('checked');
    		this.groupBox[groupCount].childNodes[0].isChecked = false;
    		
			for(var conceptCount = 0; conceptCount<this.data[groupCount]["data"].length; conceptCount++){
				var conceptBox = this.groupBox[groupCount].childNodes[2].childNodes[conceptCount];
	    		conceptBox.childNodes[0].classList.remove('checked');
	    		conceptBox.isChecked = false;
	    		conceptBox.childNodes[0].isChecked = false;
			}
		}
//    	this.setSearched(false);
    	this.newNames = [];
    	var filterContHeight = window.innerHeight-140;
//		if(document.getElementsByClassName("filter-container")[0].style.height != filterContHeight +"px")
    	document.getElementsByClassName("filter-container")[0].style.height = filterContHeight +"px";
    	document.getElementsByClassName("nav-bottom")[0].classList.remove('deselect');
    };
    
    SideNavigation.prototype.selectCheckBox = function(boxes) {
    	var filterContHeight = window.innerHeight-140-39;
//		if(document.getElementsByClassName("filter-container")[0].style.height != filterContHeight +"px")
    	document.getElementsByClassName("filter-container")[0].style.height = filterContHeight +"px";
    	for(var count = 0; count<boxes.length; count++){
    		for(var groupCount = 0; groupCount<this.data.length; groupCount++){
    			if(this.data[groupCount].length>1){
    				for(var conceptCount = 1; conceptCount<this.data[groupCount].length; conceptCount++){
		    			var conceptBox = this.groupBox[groupCount].childNodes[2].childNodes[conceptCount-1];
    					if(boxes[count] == conceptBox.childNodes[1].innerHTML.toLowerCase()){
		        			conceptBox.childNodes[0].classList.add('checked');
		            		conceptBox.isChecked = true;
		            		conceptBox.childNodes[0].isChecked = true;
		            		this.newNames.push(boxes[count]);
		        		}
    				}
    			}
        	}
    	}

    	if(this.newNames.length>0){
   		document.getElementsByClassName("nav-bottom")[0].classList.add('deselect');
    		if(window.innerWidth>900){
    			document.getElementsByClassName('clear-item')[0].classList.remove('hide-back');
    		}
    		this.setSearched(true);
    	}
    	else{
   		document.getElementsByClassName("nav-bottom")[0].classList.remove('deselect');
    		document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
    		this.setSearched(false);
    	}
    	
    };
    
    SideNavigation.prototype.conceptBoxFn = function(e) {
    	e.stopPropagation();
    	var filter_Eid , filterID ;
       /* for(var i = 0 ; i < this.dataEidArray.length ; i++){
        	for(var j = 0 ; j < this.dataEidArray[i].length ; j++){
            	if(this.dataEidArray[i][j] == e.currentTarget.innerText){
            		 filter_Eid = this.dataEidArray[i][j] ;
            	}
            }
        }*/
    	
    	var listName = getNthParentOf(e.target,6);
    	
    	if(listName.className =="concept-filter-tab sort-box-concept"){
    		
    		for(var i = 0 ; i < conceptsEidArray.length ; i++){
            	if(conceptsEidArray[i].name == e.currentTarget.parentElement.childNodes[1].innerText){
            		 filter_Eid = conceptsEidArray[i].encodedID ;
            	}
            	}
    		filterID = "context_eid" ;
    	}else if(listName.className == "standard-filter standards-filter-list"){
    		
    		for (var i = 0 ; i < standardsIdArray.length ; i++ ) {

    			if(standardsIdObject[standardsIdArray[i]].label == e.target.nextElementSibling.innerHTML ){
    				filter_Eid = standardsIdObject[standardsIdArray[i]].sid ;
    			}

    			}
    		filterID = "sid" ;
    	}
    	
    	if(e.currentTarget.isChecked){
    		e.currentTarget.childNodes[0].classList.remove('checked');
    		e.currentTarget.isChecked = false;
    		e.currentTarget.childNodes[0].isChecked = false;
    		
    		e.currentTarget.parentNode.parentNode.firstChild.classList.remove('checked');
    		e.currentTarget.parentNode.parentNode.firstChild.isChecked = false;
    	}
    	else{
    		e.currentTarget.childNodes[0].classList.add('checked');
    		e.currentTarget.isChecked = true;
    		e.currentTarget.childNodes[0].isChecked = true;
    		
    		if(!this.dataGroup){
    			if(filterID == "context_eid"){
        	
            				 readerAppHelper.addADSEvents('FBS_SIMULATION_FILTER',{
           	              //action_name:'FBS_SIMULATION_FILTER',
           	           context_eid : filter_Eid
           	          });
        		}else if(filterID == "sid"){
        			
        			 readerAppHelper.addADSEvents('FBS_SIMULATION_FILTER_STANDARD',{
          	             // action_name:'FBS_SIMULATION_FILTER_STANDARD',
          	            sid : filter_Eid,
                        filterType:"standard"
          	          });
        		}
    			//_dexterEventCheckBox(filter_Eid);
    			//_dexterEventCheckBox.apply(this,[filter_Eid]);
    		}
    		
    		if(e.currentTarget.parentNode.parentNode.childNodes[0].isChecked == false){
    			for(var conceptCount = 0; conceptCount<e.currentTarget.parentNode.childNodes.length; conceptCount++){
        			var conceptBox = e.currentTarget.parentNode.childNodes[conceptCount];
        			if(conceptBox.isChecked == false){
        				break;
        			}
        			else if(conceptCount==(e.currentTarget.parentNode.childNodes.length-1)){
        				e.currentTarget.parentNode.parentNode.childNodes[0].click();
        			}
        		}
    		}
    	}

    	var name = e.currentTarget.childNodes[1].getAttribute("data")?e.currentTarget.childNodes[1].getAttribute("data").toLowerCase(): e.currentTarget.childNodes[1].innerHTML.toLowerCase();
    	this.oldNames = this.newNames;
    	this.newNames = [];
    	
    	for(var i = 0; i<this.oldNames.length; i++){
    		if(this.oldNames[i]==name){
    			//this.names = this.names.splice(i, 1);
    		}
    		else{
    			this.newNames.push(this.oldNames[i]);
    		}
    	}
    	
    	if(this.newNames.length==0 && e.currentTarget.isChecked || e.currentTarget.isChecked){
    		this.newNames.push(name);
    	}
    	var filterContHeight;
    	if(this.newNames.length>0){
    		filterContHeight = window.innerHeight-140-39;
//    		if(document.getElementsByClassName("filter-container")[0].style.height != filterContHeight +"px")
    			document.getElementsByClassName("filter-container")[0].style.height = filterContHeight +"px";
   		document.getElementsByClassName("nav-bottom")[0].classList.add('deselect');
    		if(window.innerWidth>900){
    			document.getElementsByClassName('clear-item')[0].classList.remove('hide-back');
    		}
    		this.setSearched(true);
    	}
    	else{
    		if(sidenav2.newNames.length == 0 && sidenav.newNames.length==0){
    			filterContHeight = window.innerHeight-140;
//    			if(document.getElementsByClassName("filter-container")[0].style.height != filterContHeight +"px")
    				document.getElementsByClassName("filter-container")[0].style.height = filterContHeight +"px";
    			document.getElementsByClassName("nav-bottom")[0].classList.remove('deselect');
    		}
//  		
    		document.getElementsByClassName('clear-item')[0].classList.add('hide-back');
    		this.setSearched(false);
    	}
    	
    	this.search(this.newNames);
    };
    
    function getNthParentOf(elem,i) {
        while(i>0) {
            elem = elem.parentElement ;
            i--;
        }
        return elem;
    }
	
	/*  function _dexterEventCheckBox(){
  	  	dexterjs.logEvent("FBS_SIMULATION_FILTER", {
            context_eid : filter_Eid
        });
    }*/
    
    return SideNavigation;
	
});;define('ajax',[],function(){
	
	/**
	 * @namespace ajax
	 */
	var ajax = {};
	
	/**
	 * ajax GET method
	 * @method loadURL
	 * @memberof ajax
	 * @param {string} URI to the location
	 * @param {function | object} callback function callback to the ajax request, if Object is passed callback would be included inside the object
	 */
    ajax.loadURL = function(url,options) {
    	var callback = options,
        xhr = new XMLHttpRequest();
    	
    	if(options instanceof Object && !(options instanceof Function)){
           callback = options.callback;
            for(var x in options){
            	if(options.hasOwnProperty(x)){
            		xhr[x] = options[x];	
            	}
            }
    	}
    	
        xhr.onreadystatechange = function() {
            if(this.readyState === 4) {
                if(callback) callback(this.responseText);
            }
        };
        xhr.open('GET', url);
        xhr.send();
    };
    
    return ajax;
	
});define('file',[],function(){
	
	var file = {};

	file.readFromFile = function(fileName, cb, errorFunc) {
        var pathToFile = 'file:///data/data/org.ck12.simulations/files/' + fileName;
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    //cb(JSON.parse(this.result));
                    cb(this.result);
                };

                reader.readAsText(file);
            }, errorFunc);
        }, errorFunc);
    };
	
    file.writeToFile = function(fileName, data) {
        data = JSON.stringify(data, null, '\t');
        window.resolveLocalFileSystemURL('file:///data/data/org.ck12.simulations/files/', function (directoryEntry) {
            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        console.log('Write of file "' + fileName + '"" completed.');
                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, file.errorHandler.bind(null, fileName));
            }, file.errorHandler.bind(null, fileName));
        }, file.errorHandler.bind(null, fileName));
    };

    file.errorHandler = function (fileName, e) {  
	    var msg = '';

	    switch (e.code) {
	        case FileError.QUOTA_EXCEEDED_ERR:
	            msg = 'Storage quota exceeded';
	            break;
	        case FileError.NOT_FOUND_ERR:
	            msg = 'File not found';
	            break;
	        case FileError.SECURITY_ERR:
	            msg = 'Security error';
	            break;
	        case FileError.INVALID_MODIFICATION_ERR:
	            msg = 'Invalid modification';
	            break;
	        case FileError.INVALID_STATE_ERR:
	            msg = 'Invalid state';
	            break;
	        default:
	            msg = 'Unknown error';
	            break;
    	};
	    console.log('Error (' + fileName + '): ' + msg);
	};
    
    return file;
	
});