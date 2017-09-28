define(['jquery', 'templates/profile.builder.templates'], function ($) {
        'use strict';

        var profileBuilderController;
        var memberName;
        var emailTemplate;
        var userLocation;
        var userRoleName = '';
        var redirectFunction;
        function profileBuilderView() {

           function renderGrades(grades, isUnderage, memberGrades) {
             /*   if (grades instanceof Array && grades.length) {
                    require(['text!templates/grades.row.html'], function (template) {
                        for (var index = 0; index < grades.length; index++) {
                            var gradeHTML = template;
                            gradeHTML = gradeHTML.replace('@@gradeId@@', grades[index].id || '');
                            if (grades[index].id === 1) {
                                gradeHTML = gradeHTML.replace('@@gradeName@@', 'Kindergarten');
                                gradeHTML = gradeHTML.replace('@@inlineClass@@','');
                            } else {
                                gradeHTML = gradeHTML.replace('@@gradeName@@', grades[index].name);
                                gradeHTML = gradeHTML.replace('@@inlineClass@@','inlineGrades');
                            }
                            $('#gradeSelectionForm').append(gradeHTML);
                        }
                        bindEvents();
                        //If member is under 13, don't allow to change the role
                        if (isUnderage){
                            $('.role_container').off('click');
                        }
                        setMembergrades(memberGrades);
                    });
                }
           */}

           function renderProfileInformation(result) {
                var member = result.member,
                grades = result.grades,
                allRoles = result.allRoles;
                
               var  memberName = member.lastName? member.firstName + ' ' + member.lastName:member.firstName;
               		$('#userName').empty();
               		$('#userName').val(memberName + ".");
               		
               		$('#userName').attr('size',$('#userName').val().length);
               		
               	if(member.role&&member.role.name!=='member'){
               	//	$('#selectUserRole').empty();  
               	//	$('#selectUserRole').append(member.role.name+'.');                		
               	}
               	 if (member.imageURL){
                     $('.uploadimage_btn_display').text('Edit Photo');
                     if(member.imageURL.indexOf("flx")!==-1){
                     $('#profileImage').attr('src', window.API_SERVER_URL+member.imageURL);
                     }
                     else{
                    	 $('#profileImage').attr('src', member.imageURL);
                     }
                 }
               	 else{
               		$('.uploadimage_btn_display').text('Upload a photo');
               	 }
               	 if (member.address){
                     userLocation = {};
                     userLocation.city = member.address.city;
                     userLocation.state = member.address.province;
                     userLocation.province = member.address.province;
                     userLocation.country = member.address.country;
                     userLocation.zip = member.address.postalCode;

                     var addressTxt = '';
                     var shrtAddressTxt = '';
                     var country = userLocation.country.split(': ');
                     if (country[0] === 'US') {
                         shrtAddressTxt = userLocation.city + ', ' + userLocation.state;
                         addressTxt = userLocation.city + ', ' + userLocation.province;
                         if (userLocation.zip){
                             addressTxt += ' ' + userLocation.zip;
                         }
                         $('#usLocation').val(addressTxt);

                         $('#usLocationContainer').addClass('hide');
                         $('#internationalLocationContainer').removeClass('hide');
                     }
                     else {
                         shrtAddressTxt = userLocation.city + ', ' + country[1];
                         addressTxt = userLocation.city + ', ' + userLocation.province + ', ' + country[1];
                         if (userLocation.zip){
                             addressTxt += ' ' + userLocation.zip;
                         }
                         $('#internationalLocation').val(addressTxt);

                         $('#usLocationContainer').removeClass('hide');
                         $('#internationalLocationContainer').addClass('hide');
                     }

                     $('.js_location_select_link').text(shrtAddressTxt+".");
                     
                 }
             /*   require(['text!templates/member.information.html'], function (template) {
                    var memberHTML = template;
                    memberName = member.lastName? member.firstName + ' ' + member.lastName:member.firstName;
                    memberHTML = memberHTML.replace('@@userName@@', memberName);
                    var rolesTxt = '';
                    var isValidRole = false;
                    for (var index = 0; index < allRoles.length; index++) {
                        if ( (""+member.role.id) === (""+allRoles[index].id) ) {
                            isValidRole = true;
                        }
                        rolesTxt += '<li id = '+ allRoles[index].id +' class="roleOption">' + allRoles[index].name + '</li>';
                    }
                    memberHTML = memberHTML.replace('@@userLocation@@', member.location || '');

                    $('#userInformationContainer').append(memberHTML);
                    $('#roleOptions').html(rolesTxt);
                    $('#impersonateMemberID').val(member.id);

                   
                    if (!isValidRole){
                        $('#gradeSelector').addClass('hide');
                    }else{
                        $('#selectUserRole').text(member.role.name);
                        $('#selectUserRole').data('role-id',member.role.id);
                        $('#gradeSelector').removeClass('hide');
                        roleChanged();
                    }
                    
                   
                 
                });*/
               	  // renderGrades(grades, member.isUnderage, member.gradeIDs);
               	   bindEvents();
               		
                   profileBuilderController.initImageUploader();
                   profileBuilderController.loadLocationService();
               		
            }

            function setMembergrades1(memberGrades){
            	if (memberGrades.length){
            		if (parseInt($('#selectUserRole').data('role-id'), 10) === 5) {
            			for (var i = 0; i < memberGrades.length; i++) {
            				var grade = memberGrades[i]
	                        $('#gradeSelectionFormContainer #gradeSelectionForm #' + grade.id).toggleClass('selectdGrade');
	                        
	                        if ($('#gradeSelectionFormContainer #gradeSelectionForm .selectdGrade').length){
	                            $('.js_grade_select_link').text('');
	                            var gradesTxt = '';
	                            var cnt = 0;
	                            $("#gradeSelectionFormContainer #gradeSelectionForm .selectdGrade").each(function () {
	                                if (gradesTxt){
	                                    gradesTxt += ", " + grade.name;
	                                }else{
	                                    gradesTxt = grade.name;
	                                }
	                                cnt += 1;
	                            });
	                            
	                            var s = '';
	                            if (cnt > 1) {
	                                s = 's';
	                            }
	                            $('.js_grade_select_link').text('grade' + s + ' ' + gradesTxt.replace(/(.*),/, "$1 and "));
	                        }else{
	                            $('.js_grade_select_link').text('these grades');
	                        }
            			}
                    } else if (parseInt($('#selectUserRole').data('role-id'), 10) === 7) {
                    	var grade = memberGrades[0]
                        var superscript = '';
                        $('#gradeSelectionFormContainer #gradeSelectionForm #' + grade.id).addClass('selectdGrade');
                        if (grade.name === 'Kindergarten') {
                            $('.js_grade_select_link').text(grade.name);
                        } else {
                            if(grade.name === '1') {
                                superscript = 'st';
                            } else if(grade.name === '2') {
                                superscript = 'nd';
                            } else if(grade.name === '3') {
                                superscript = 'rd';
                            } else {
                                superscript = 'th';
                            }
                            $('.js_grade_select_link').text(grade.name + superscript + ' grade');
                        }
                    }
                }
            }
            
            function renderShareNotifaction(){
               // $('#shareNotificationModal').foundation('reveal', 'open');
            }

            function render(result,container,redirect) {
            	redirectFunction=redirect;
                require(['controllers/profile.builder', 'text!templates/profile.builder.html'], function (controller, pageTemplate) {
                    if (result && result.member && result.member.isProfileUpdated === 1){
                    
                    	redirectFunction();
                    	//return false;
                    }
                    else if (result && result.member) {
                    	pageTemplate = pageTemplate.replace('@@serverName@@', window.API_SERVER_URL);
                    	
                        profileBuilderController = controller;
                        $('#'+container).html(pageTemplate);
                    	$('#continue_btn').prop('disabled',true);
                       // $('#profileBuilderModal').foundation('reveal', 'open');
                        $('#'+container).addClass('app-page-Image');
                        renderProfileInformation(result);
                        readerAppHelper.logScreenViewEventForApp('Profile');
                    }
                });
             /*   requirejs([ '../../ck12-components/dexterjs/dexterjs.min'], function (dexter) {
          	       	 if(window.dexter){
          	                reader.dexterjs = window.dexterjs;
          	         }
                });*/
            }

            function shareOnEmail(event){
                $('#done_btn').trigger('click');
                if (! emailTemplate){
                    require(['text!templates/share.registration.email.html'], function (template) {
                        emailTemplate = template;
                        emailTemplate = emailTemplate.replace('@@userName@@',memberName );
                        ShareEmailView.open({
                            'shareTitle': 'I joined CK-12!',
                            'shareUrl': window.location.href,
                            'shareBody': emailTemplate,
                            'userSignedIn': window.ck12_signed_in || false,
                            'context': 'Share CK-12 Foundation',
                            'payload': {
                                'memberID': ads_userid,
                            }
                        });
                    });
                } else {
                    ShareEmailView.open({
                        'shareTitle': 'I joined CK-12!',
                        'shareUrl': window.location.href,
                        'shareBody': emailTemplate,
                        'userSignedIn': window.ck12_signed_in || false,
                        'context': 'Share CK-12 Foundation',
                        'payload': {
                            'memberID': ads_userid,
                        }
                    });
                }
            }

            function roleChanged(){
                var roleName = $("#selectUserRole").text();
                if (roleName === 'teacher.'){
                    $('#gradeSelector').removeClass('hide');
                    $('#gradeSelector .message').text('I teach');
                    $('.js_grade_select_link').text('these grades');
                }else if (roleName === 'parent'){
                    $('#gradeSelector').removeClass('hide');
                    $('#gradeSelector .message').text("I'm interested in resources for:");
                }else if (roleName === 'student.'){
                    $('#gradeSelector').removeClass('hide');
                    $('#gradeSelector .message').text("I'm in");
                    $('.js_grade_select_link').text('select grade');
                } else {
                    $('#gradeSelector').addClass('hide');
                }
            }

            function toggleLocationForm() {
                $('#internationalLocationContainer').toggle();
                $('#usLocationContainer').toggle();
            }
            function bindEvents(){
                var placeHoldeObject={
                		role:'student',
                		location:'',
                		grades:[]   			
                }
            	function clickedUserRole(){
                	$("#roleOptions").removeClass("no-display");
            		$("#locationSelectionFormContainer").addClass("hide");
            		$("#gradeSelectionFormContainer").addClass("hide");
            		$(".skip-continue-buttons").removeClass("hide");
            		$("#button-continue")[0].value="Next";
            		$('.app-page').addClass('animator');
            		
            		$("#selectUserRole").addClass('edit-mode');
            		$("#location-selector").removeClass('edit-mode');
            		$("#gradeSelector").removeClass('edit-mode');
            		
            		$("#profileBuilderModal").removeClass("screenslideinbottom-100px").removeClass("screenslideinbottom-150px").addClass("screenslideoutbottom-0px");
            		$("#profileBuilderModal-inputDetails").removeClass("hide").removeClass("slideoutBottom").addClass("slideinBottom");
                }

            	$("#selectUserRole").off("click.okay").on("click.okay",function(){
            		clickedUserRole();
            		
            	});
            	$("#roleOption-1").off("click.okay").on("click.okay",function(){
            		$("#role_opt").empty().val("teacher.");
            		$(".message").empty().append("I teach");
            		$('#gradeInput').attr('placeholder','these grades');
            		$("#selectUserRole").removeClass("bg-pink-semitransparent").addClass("bg-black-semitransparent");
            		$("#roleOption-1").addClass('bg-green-semitransparent');
            	    $("#roleOption-2").removeClass('bg-green-semitransparent');
            		if($("#roleOption-1").prop('checked') || $("#roleOption-2").prop('checked')){
            			
            		}
            		$('#continue_btn').prop('disabled',false);
            		$('#continue_btn').removeClass('disabled');
            		$(".grades-row-2").children().removeClass('selectedGrade');
        	    	$(".grades-row-3").children().removeClass('selectedGrade');
        	    	$(".grades-row-4").children().removeClass('selectedGrade');
            	    $('#grades-subRow-1').empty().append("Select grades:");
            	    $('#grade-selector-link').removeClass('subscriptRemover'); 
            	    $("#te-su").html("I teach");
            		placeHoldeObject.role='teacher';
            		$(".js_grade_select_link").empty();
            		$(".js_grade_select_link").val('');
            		placeHoldeObject.grades=[];
            		$('#gradeInput').attr('size',$('#gradeInput').val().length);
            		$(".js_grade_select_link").removeClass("bg-black-semitransparent");
	        	    readerAppHelper.logAppADSEvent('APP_ACTION',{
	        	    	action_name:'Profile/SelectRole',
	                    input_value: placeHoldeObject.role,
	                    screen_name:"Profile",
	                    action_type:'link'
	                });
            	});
            	$("#roleOption-2").off("click.okay").on("click.okay",function(){
            		$("#role_opt").empty().val("student.");
            		$(".message").empty().append("I'm in");
            		$('#gradeInput').attr('placeholder','this grade');
            		$("#selectUserRole").removeClass("bg-pink-semitransparent").addClass("bg-black-semitransparent");
            		$("#roleOption-1").removeClass('bg-green-semitransparent');
            		$("#roleOption-2").addClass('bg-green-semitransparent');
            		if($("#roleOption-1").prop('checked') || $("#roleOption-2").prop('checked')){
            			$('#continue_btn').prop('disabled',false);
            		}
            		$('#continue_btn').prop('disabled',false);
            		$('#continue_btn').removeClass('disabled');
            		//$('#button-continue').removeClass('disabled');
            		$(".grades-row-2").children().removeClass('selectedGrade');
        	    	$(".grades-row-3").children().removeClass('selectedGrade');
        	    	$(".grades-row-4").children().removeClass('selectedGrade');
        	    	$('#grades-subRow-1').empty().append("Select grade:");
        	    	$('#grade-selector-link').removeClass('subscriptRemover'); 
        	    	$("#te-su").html("I'm in");
            		placeHoldeObject.role='student'
            		$(".js_grade_select_link").empty();
            		$(".js_grade_select_link").val('');
            		placeHoldeObject.grades=[];
            		$('#gradeInput').attr('size',$('#gradeInput').val().length);
            		$(".js_grade_select_link").removeClass("bg-black-semitransparent");
            		readerAppHelper.logAppADSEvent('APP_ACTION',{
	                    action_name:'Profile/SelectRole',
	                    input_value: placeHoldeObject.role,
	                    screen_name:"Profile",
	                    action_type:'link'
                    });
            	});
            	
            	function clickedLocationSelector(){
            		$("#roleOptions").addClass("no-display");
            		$("#locationSelectionFormContainer").removeClass("hide")
            		$("#gradeSelectionFormContainer").addClass("hide");
            		$("#usLocationContainer").removeClass('hide');
            		$("#internationalLocationContainer").addClass('hide');
            		$(".skip-continue-buttons").removeClass("hide")
            		$("#button-continue")[0].value="Next";
            		$('.app-page').addClass('animator');

            		$("#selectUserRole").removeClass('edit-mode');
            		$("#location-selector").addClass('edit-mode');
            		$("#gradeSelector").removeClass('edit-mode');
            		
            		$("#profileBuilderModal-inputDetails").removeClass("hide").removeClass("slideoutBottom").addClass("slideinBottom");
            		$("#profileBuilderModal").addClass("screenslideinbottom-100px").removeClass("screenslideinbottom-150px").removeClass("screenslideoutbottom-0px");

            	}
            	$("#location-selector").off("click.okay").on("click.okay",function(){
            		
            		clickedLocationSelector();
            		
            	});
            	$(".us-location-link").off("click.okay").on("click.okay",function(){
            		$("#internationalLocationContainer").addClass("hide")
            		$("#usLocationContainer").removeClass('hide');
            	});
            	$(".international-location-link").off("click.okay").on("click.okay",function(){
            		$("#internationalLocationContainer").removeClass("hide")
            		$("#usLocationContainer").addClass('hide');
            	});
            	function clickedGradeSelector(){
            		$("#roleOptions").addClass("no-display");
            		$("#locationSelectionFormContainer").addClass("hide")
            		$("#gradeSelectionFormContainer").removeClass("hide");
            		$(".skip-continue-buttons").removeClass("hide")
            		$("#button-continue")[0].value="Done";
            		$('.app-page').addClass('animator');
            		
            		$("#selectUserRole").removeClass('edit-mode');
            		$("#location-selector").removeClass('edit-mode');
            		$("#gradeSelector").addClass('edit-mode');
            		
            		$("#profileBuilderModal-inputDetails").removeClass("hide").removeClass("slideoutBottom").addClass("slideinBottom");
            		$("#profileBuilderModal").removeClass("screenslideinbottom-100px").addClass("screenslideinbottom-150px").removeClass("screenslideoutbottom-0px");
            	}
            	$("#grade-selector").off("click.okay").on("click.okay",function(){
            		clickedGradeSelector()
            		
            	});
            	$(document).mouseup(function (e)
        		{
        		    var container = $("#profileBuilderModal-inputDetails"),
        		    inputs1=$("#selectUserRole"),
        		    inputs2=$("#location-selector"),
        		    inputs3=$(".js_grade_select_link");
        		    if (!container.is(e.target) // if the target of the click isn't the container...
        		        && (container.has(e.target).length === 0) && !container.hasClass('slideoutBottom')&&(!inputs1.is(e.target)) &&(!inputs2.is(e.target))&&(!inputs3.is(e.target))) // ... nor a descendant of the container
        		    {
        		    	$('.app-page').removeClass('animator');
        		        container.addClass('slideoutBottom').delay(201).queue(function(){
        		        container.addClass('hide').dequeue();});
        		        $("#profileBuilderModal").removeClass("screenslideinbottom-100px").removeClass("screenslideinbottom-150px").addClass("screenslideoutbottom-0px");
        		    }
        		});
            	$(".grades").off("click.okay").on("click.okay",function(e){
            	    if(placeHoldeObject.role==='teacher'){ 
            	    	$(e.currentTarget).toggleClass('selectedGrade');
            	    	var value=e.currentTarget.innerHTML+"";
            	    	if(placeHoldeObject.grades.indexOf(value)==-1){
            	    		placeHoldeObject.grades.push(value);
            	    	}
            	    	else{
            	    		placeHoldeObject.grades.splice(placeHoldeObject.grades.indexOf(value),1);
            	    	}
            	    }
            	    else{
            	    	$(".grades-row-2").children().removeClass('selectedGrade');
            	    	$(".grades-row-3").children().removeClass('selectedGrade');
            	    	$(".grades-row-4").children().removeClass('selectedGrade');
            	    	$(e.currentTarget).addClass('selectedGrade');	
            	    	placeHoldeObject.grades=[];
            	    	var value=e.currentTarget.innerHTML+'';
            	    	
            	    	placeHoldeObject.grades.push(value);
            	    }
            	    setMembergrades(placeHoldeObject);
            	   // $(".js_grade_select_link").empty().append(placeHoldeObject.grades.toString());
            	   // $(".js_grade_select_link").removeClass("bg-pink-semitransparent").addClass("bg-black-semitransparent");
            	});
            	$(".close-popup").off("click").on("click",function(){
            		closePopup();
                });
            	function closePopup(){
            		$('.app-page').removeClass('animator');
            		$("#profileBuilderModal-inputDetails").addClass('slideoutBottom').delay(201).queue(function(){
        				$("#profileBuilderModal-inputDetails").addClass('hide').dequeue();});
            		$("#profileBuilderModal").removeClass("screenslideinbottom-100px").removeClass("screenslideinbottom-150px").addClass("screenslideoutbottom-0px");
            	}
            	function setMembergrades(member){
                	var memberGrades=member.grades,memberRole=member.role;
                	var grades=[];
                	var gradesTxt = '';
                    var cnt = 0;
                    
                	if (memberGrades.length){
                		if (memberRole === "teacher") {
                			$("#gradeSelectionFormContainer #gradeSelectionForm .selectedGrade").each(function () {
                				grades[grades.length] = $(this)[0].innerHTML+'';
                            });

                			
                			for (var i = 0; i < memberGrades.length; i++) {
                				var grade = grades[i]
    	                     
    	                        
    	                        if ($('#gradeSelectionFormContainer #gradeSelectionForm .selectedGrade').length){
    	                            $('.js_grade_select_link').empty();
    	                            
    	                     //       $("#gradeSelectionFormContainer #gradeSelectionForm .selectedGrade").each(function () {
    	                                if (gradesTxt){
    	                                    gradesTxt += ", " + grade;
    	                                }else{
    	                                    gradesTxt = grade;
    	                                }
    	                                cnt += 1;
    	                        //    });
    	                            
    	                            var s = '';
    	                            if (cnt > 1) {
    	                                s = 's';
    	                            }
    	                            $('.js_grade_select_link').val('grade' + s + ' ' + gradesTxt+'.');
    	                            $(".js_grade_select_link").removeClass("bg-pink-semitransparent").addClass("bg-black-semitransparent");
    	                            $('#grade-selector-link').addClass('subscriptRemover'); 
    	                        }else{
    	                            $('.js_grade_select_link').append('these grades');
    	                        }
                			}
                        } else if (memberRole === "student") {
                        	var grade = memberGrades[0]
                            var superscript = '';
                           // $('#gradeSelectionFormContainer #gradeSelectionForm #' + grade.id).addClass('selectdGrade');
                            if (grade === 'Kindergarten') {
                                $('.js_grade_select_link').empty();
       $('.js_grade_select_link').val(grade+'.');
                                $(".js_grade_select_link").removeClass("bg-pink-semitransparent").addClass("bg-black-semitransparent");
                                $('#grade-selector-link').addClass('subscriptRemover'); 
                            } else {
                                if(grade === '1') {
                                    superscript = 'st';
                                } else if(grade === '2') {
                                    superscript = 'nd';
                                } else if(grade === '3') {
                                    superscript = 'rd';
                                } else {
                                    superscript = 'th';
                                }
                                $('.js_grade_select_link').empty();
                                $('.js_grade_select_link').val(grade+ superscript + ' grade'+'.');
                                $(".js_grade_select_link").removeClass("bg-pink-semitransparent").addClass("bg-black-semitransparent");
                                $('#grade-selector-link').addClass('subscriptRemover'); 
                            }
                        }
                    }else {
                    	$('.js_grade_select_link').empty();
                        //$('.js_grade_select_link').addClass('bg-pink-semitransparent').removeClass('bg-black-semitransparent');
                        if (memberRole === 'teacher') {
                        	$('.js_grade_select_link').val('');
                        }
                        else if (memberRole === 'student') {                    	
                        	$('.js_grade_select_link').val('');
                        }
                    }

                    $('#gradeInput').attr('size',$('#gradeInput').val().length);
                    
                }
            	$('#continue_btn').off('click.create').on('click.create',function(e){
            			if(!$('#continue_btn').hasClass('disabled')){
            				if(window.readerAppHelper.checkForServer()){
            					updateProfile(e,placeHoldeObject);
            				}else{
            					window.readerAppHelper.checkForNetwork();
            				}
            				
            		}
            		else{
            			
            		}
            	});
            	
            	$('#button-continue').off('click.create').on('click.create',function(e){
            		if($('#button-continue').hasClass('disabled')){
            			
            		}
            		else{
                  if($("#profileBuilderModal").hasClass("screenslideinbottom-100px")){
                    if($("#internationalLocationContainer").hasClass("hide")){
                      var location = $("#usLocation").val();
                      if(location!=""){
                          location =   location.split(",")[0]+","+ location.split(",")[1]+"."
                      }
            			
                        $('.js_location_select_link').val(location);

                    }else{
                      var location = $("#internationalLocation").val();
                        if(location!=""){
                      location =   location.split(",")[0]+","+ location.split(",")[location.split(",").length-1]+"."
                    }
                        $('.js_location_select_link').val(location);
                    }
                  }
            			//$( "#foo" ).trigger( "click" );
            			if($( ".edit-mode" ).attr('id')==="selectUserRole"){
            				clickedLocationSelector();
            			}
            			else if($( ".edit-mode" ).attr('id')==="location-selector"){
            				clickedGradeSelector();
            			}
            			else if($( ".edit-mode" ).attr('id')==="gradeSelector"){
            				closePopup();
            				$("#profileBuilderModal").removeClass("screenslideinbottom-100px").removeClass("screenslideinbottom-150px").addClass("screenslideoutbottom-0px");
            			}
            		}
            	});
            	
            	var locationChangedCallback = function(address) {
                    userLocation = address;
                    var shrtAddressTxt = '';
                    var country = userLocation.country.split(': ');
                    if (country[0] === 'US') {
                        shrtAddressTxt = userLocation.city + ', ' + userLocation.state;
                    }
                    else {
                        shrtAddressTxt = userLocation.city + ', ' + country[1];
                    }
                    readerAppHelper.logAppADSEvent('APP_ACTION',{
                        action_name:'Profile/SelectLocation',
                        input_value: shrtAddressTxt,
                        screen_name:"Profile",
                        action_type:'inputBox'
                     });
                    $('.js_location_select_link').val(shrtAddressTxt +'.');
                  //  $('#locationSelectionFormContainer').css({'display':'none'});
                    $(".js_location_select_link").removeClass("bg-pink-semitransparent").addClass("bg-black-semitransparent");
                    $('#location-selector').addClass('subscriptRemover'); 
                };
                profileBuilderController.setLocationChangedCallback(locationChangedCallback);

            	
            	 function updateProfile(e,placeHolder) {
                     e.preventDefault();
                     var roleID, imageURL, member;
                     var grades = new Array();
                    // roleID = $('#selectUserRole').data('role-id');
                    //   roleID=placeHolder.role;
                     if(placeHolder.role==="teacher"){
                    	 roleID='5';
                     }
                     else if(placeHolder.role==="student"){
                    	 roleID='7';
                     }
                     
                     if (!roleID){
                         roleID='5';
                     }
                     //userRoleName = $('#selectUserRole').text();
                 
                     $("#gradeSelectionForm .selectedGrade").each(function () {
                         grades[grades.length] = $(this).attr("id");
                     });

                     member = {
                         'roleID': roleID
                     };

                     if ($('#profileImage').data('default-image') === 'false'){
                         imageURL = $('#profileImage').data('image-url');
                         member.imageURL = imageURL;
                     }

                     if (userLocation) {
                         $.each(userLocation,function(key, value){
                             member[key] = value;
                         });
                         // ADS tracks FBS_LOCATION_INFO
                         var payload = {};
                         payload.referrer = 'profile_builder';
                         if (window._ck12){
                             _ck12.logEvent('FBS_LOCATION_INFO', payload);
                         }
                     }

                     if (grades){
                         member.gradeIDs = JSON.stringify(grades);
                         readerAppHelper.logAppADSEvent('APP_ACTION',{
                             action_name:'Profile/SelectGrade',
                             input_value: grades,
                             screen_name:"Profile",
                             action_type:'link'
                          });
                     }
                     profileBuilderController.saveUserProfile(continueCallback, member);
                 }
            	 function continueCallback(result) {
                  
            		 console.log(result);
            		 redirectFunction();
                 }
            
            }
            
          
            this.render = render;

            this.profileImageUploadCallback = function(image){
                if (image.uri){
                    $('#profileImage').attr('src',window.API_SERVER_URL+ image.display_uri);
                    $('#profileImage').data('image-url', image.uri);
                    readerAppHelper.appLocalStorage.setItem("userImage",image.uri)
                    $('#profileImage').data('default-image', 'false');
                    $("#ajaxLoadingWait").addClass('no-display');
                    $("#profileImage").removeClass('no-display');
                    readerAppHelper.logAppADSEvent('APP_ACTION',{
                    	action_name:'Profile/UploadPhoto',
                    	input_value: '',
                    	screen_name:"Profile",
                    	action_type:'input'
                    });
                }
            }

        }
        
        return new profileBuilderView();
    });
