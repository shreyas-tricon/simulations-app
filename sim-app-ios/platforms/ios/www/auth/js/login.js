requirejs([],function(){window.reader={},readerAppHelper.logScreenViewEventForApp("Welcome")}),function(){function a(){b()}function b(){function a(a){return console.log(a.keyCode),13==a.keyCode?(a.preventDefault(),temp=document.activeElement,temp.blur(),!1):!0}$(".signin-link").off("click").on("click",function(){$(".home-screen").addClass("hide"),$(".signin-form-parent").removeClass("hide")}),$(".signin-google").on("click",function(){g.googleLogin()}),g.bindGPlayClickEvent(),$("#cancelButton").bind("click",function(){window.location.href="index.html"}),$("#login-form").submit(function(a){a.preventDefault(),localStorage.removeItem("user"),$("#message").removeClass("hide").html("signing in ...");var b=$(this),c=b.find("input[name='usrname']").val(),d=b.find("input[name='password']").val();(""==c||""==d)&&$("#message").removeClass("hide").html("Please enter username and password."),""!==c&&""!==d&&g.userLogin(c,d,function(a){0==a.responseHeader.status&&a.response.sessionID?($(".landing-page").addClass("hide"),$(".app-container").removeClass("hide"),a.response.role.is_admin_role?(void 0!=typeof Storage&&readerAppHelper.setUserInfo(a.response),window.location.href="../www/index.html"):(void 0!=typeof Storage&&readerAppHelper.setUserInfo(a.response),window.location.href="../www/index.html")):a.response.message&&($("#loginButton").addClass("disabled"),$("#message").removeClass("hide").html(a.response.message))})}),$("#signInButton").off("click").on("click",function(a){a.stopPropagation(),$(".active-login-view").removeClass("active-login-view").next().addClass("active-login-view"),clearInterval(f),$(".signin-form-parent ").removeClass("hide").removeClass("slideAnimation-signin-form-parent-100").addClass("slideAnimation-signin-form-parent-0").delay(10).queue(function(){$(".app-landing-page  ").delay(550).queue(function(){})}),readerAppHelper.logScreenViewEventForApp("SignIn")}),$("#signUpButton").off("click").on("click",function(a){a.stopPropagation(),$(".active-login-view").removeClass("active-login-view").next().addClass("active-login-view"),$(".signin-screen-parent ").removeClass("hide").addClass("slideAnimation-signin-screen-parent-0").removeClass("slideAnimation-signin-screen-parent-100").delay(10).queue(function(){$(".signin-form-parent ").removeClass("slideAnimation-signin-form-parent-0").addClass("slideAnimation-signin-form-parent--50").delay(550).queue(function(){})}),readerAppHelper.logScreenViewEventForApp("SignUp")}),$(".signup-bottom").off("click").on("click",function(){$(".active-login-view").removeClass("active-login-view").prev().addClass("active-login-view"),$(".signin-form-parent ").addClass("slideAnimation-signin-form-parent-50").removeClass("slideAnimation-signin-form-parent-100").removeClass("hide").delay(50).queue(function(){$(".signin-screen-parent ").removeClass("slideAnimation-signin-screen-parent-0").addClass("slideAnimation-signin-screen-parent--50").delay(550).queue(function(){$(this).removeClass("slideAnimation-signin-screen-parent--50").addClass("hide").dequeue()}),$(this).removeClass("slideAnimation-signin-form-parent-50").addClass("slideAnimation-signin-form-parent-0").dequeue()}),readerAppHelper.logScreenViewEventForApp("SignIn")}),$(".app-landing-page").off("click").on("click",function(){document.getElementsByClassName("signin-form-parent")[0].classList.contains("slideAnimation-signin-form-parent-100")?(d(),readerAppHelper.logScreenViewEventForApp("SignIn")):(c(),readerAppHelper.logScreenViewEventForApp("Welcome"))}),$(".close-signup").off("click").on("click",function(){d(),readerAppHelper.logScreenViewEventForApp("SignIn")}),$(".validate-input").off("change.signin").on("change.signin",function(){this.value&&$(".validate-input").not(this).val()?($(".signin-submit").prop("disabled",!1),$(".signin-submit").removeClass("disabled grey")):($(".signin-submit").prop("disabled",!0),$(".signin-submit").addClass("disabled grey"))}).off("keyup.signin input.signin").on("keyup.signin input.signin",function(b){this.value&&$(".validate-input").not(this).val()?($(".signin-submit").prop("disabled",!1),$(".signin-submit").removeClass("disabled grey")):($(".signin-submit").prop("disabled",!0),$(".signin-submit").addClass("disabled grey")),13===(b.keyCode||b.which)&&(a(b),$(".signin-submit").trigger("click"))}),$(".signup-submit").off("click").on("click",function(a){a.preventDefault();var b=$("#signUpForm"),c=b.find("[name=fullname]").val(),d=b.find("[name=email]").val(),e=b.find("[name=password]").val(),f=$("#signUpForm input[required]"),h=/(^[-!#$%&'*+\/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+\/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[A-Z0-9]+(?:-*[A-Z0-9]+)*\.)+[A-Z]{2,6}$/i,i=null,j=$.Deferred();if($("#message-signup").addClass("hide"),$(this).hasClass("disabled")||!(!b.find(".error").length>0))return $("#createUser").addClass("disabled"),!1;$(this).addClass("disabled");for(var k=0;k<f.length;k++)$(f[k]).hasClass("dob")||(""==f[k].value.trim()?($(f[k]).addClass("error"),$(f[k]).prev(".error-msg").removeClass("hide")):($(f[k]).prev(".error-msg").addClass("hide"),$(f[k]).removeClass("error")));return!b.find(".error").length>0?(-1!=c.indexOf('"')||-1!=c.indexOf("<")||-1!=c.indexOf("@")?($(b.find("[name=fullname]")).addClass("error"),$(b.find("[name=fullname]")).prevAll(".error-msg").removeClass("hide").html("Double quotes, smaller than (<) or @ are not allowed.")):$(b.find("[name=fullname]")).prevAll(".error-msg").html("Enter your full name."),h.test(jQuery.trim(d))?$(b.find("[name=email]")).removeClass("error"):($(b.find("[name=email]")).addClass("error"),$(b.find("[name=email]")).prevAll(".error-msg").removeClass("hide").html("Enter a valid email address")),e=e.replace(/\s+/g,""),e.length<6?($(b.find("[name=password]")).addClass("error"),$(b.find("[name=password]")).prevAll(".error-msg").removeClass("hide")):($(b.find("[name=password]")).removeClass("error"),$(b.find("[name=password]")).prevAll(".error-msg").addClass("hide")),readerAppHelper.validateEmail({email:d,success:function(){i=$(b.find("[name=email]")),i.removeClass("error"),j.resolve({result:"success"})},error:function(){i=$(b.find("[name=email]")),i.addClass("error"),i.prevAll(".error-msg").removeClass("hide").html("This email address is already taken."),j.resolve({result:"error"})}}),void $.when(j).done(function(a){$("#signUpForm input").hasClass("error")||"success"!==a.result||(c=c.split(" "),$("#message-signup").removeClass("hide"),$("#message-signup").html("signing up ..."),g.signUp({givenName:c[0],surname:c[1],email:d,token:e,role:"member",authType:"ck-12"}))})):($("#createUser").removeClass("disabled"),!1)}),$(".submit-email").off("click").on("click",function(a){var b=$("#forgot-pwd-form").find("[name=f-pswd]").val();""!==b&&/(^[-!#$%&'*+\/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+\/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[A-Z0-9]+(?:-*[A-Z0-9]+)*\.)+[A-Z]{2,6}$/i.test(jQuery.trim(b))?(g.forgotPassword({email:b,"landing page":!0,"send email":!0}),$("#forgot-pwd-form").find("[name=f-pswd]").prev(".error-msg").addClass("hide")):$("#forgot-pwd-form").find("[name=f-pswd]").prev(".error-msg").removeClass("hide")}),$(".validated-input").off("change.signup").on("change.signup",function(){this.value&&$(".validated-input").not(this).val()?($(".signup-submit").prop("disabled",!1),$(".signup-submit").removeClass("disabled grey")):($(".signup-submit").prop("disabled",!0),$(".signup-submit").addClass("disabled grey"))}).off("keyup.signup input.signup").on("keyup.signup input.signup",function(b){this.value&&$(".validated-input").not(this).val()?($(".signup-submit").prop("disabled",!1),$(".signup-submit").removeClass("disabled grey")):($(".signup-submit").prop("disabled",!0),$(".signup-submit").addClass("disabled grey")),13===(b.keyCode||b.which)&&(a(b),$(".signup-submit").trigger("click"))}),$("#signUpForm input").off("blur").on("blur",function(a){var b=$("#signUpForm"),c=/(^[-!#$%&'*+\/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+\/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[A-Z0-9]+(?:-*[A-Z0-9]+)*\.)+[A-Z]{2,6}$/i,d="",e="";return"pswd-change"===this.id&&(e=this.value.replace(/\s+/g,""),e.length<6)?($(this).addClass("error"),$(this).prevAll(".error-msg").removeClass("hide"),!1):void(""==$(this).val()?($(this).addClass("error"),$(this).prevAll(".error-msg").removeClass("hide"),$(this).hasClass("email")&&$(this).prev(".error-msg").html("Enter a valid email address")):($(this).prevAll(".error-msg").addClass("hide"),$(this).removeClass("error"),$(this).hasClass("email")&&(d=$(b.find("[name=email]")),c.test(jQuery.trim($(this).val()))?readerAppHelper.validateEmail({email:$.trim($(this).val()),success:function(){d.removeClass("error")},error:function(){d.addClass("error"),d.prevAll(".error-msg").removeClass("hide").html("This email address is already taken.")}}):(d.addClass("error"),d.prevAll(".error-msg").removeClass("hide").html("Enter a valid email address")))))}),$(".exit-pswd-page").off("click").on("click",function(a){window.location.href="login.html"}),$(".forgot-pswd").off("click").on("click",function(a){a.preventDefault();var b=window.API_SERVER_URL+$(this).attr("href");window.open(b,"_system","location=yes")}),$(".terms").off("click").on("click",function(a){a.preventDefault();var b=$(this).attr("href");window.open(b,"_system","location=yes")}),$(".log-in").off("click").on("click",function(a){$(".signin-screen-parent").addClass("hide"),$(".signin-form-parent ").removeClass("hide")}),$("#password_display_toggle").on("change",function(){$(this).is(":checked")?$("#pswd-change").attr("type","text"):$("#pswd-change").attr("type","password")})}function c(){$(".app-landing-page").removeClass("hide"),$(".active-login-view").removeClass("active-login-view").prev().addClass("active-login-view"),$(".signin-screen-parent").addClass("hide"),$(".signin-form-parent").removeClass("slideAnimation-signin-form-parent-0").addClass("slideAnimation-signin-form-parent-100").delay(500).queue(function(){$(this).addClass("hide").dequeue()}),$(".error-msg").addClass("hide"),$(".error").removeClass("error")}function d(){$(".active-login-view").removeClass("active-login-view").prev().addClass("active-login-view"),$(".signin-screen-parent").removeClass("slideAnimation-signin-screen-parent-0").addClass("slideAnimation-signin-screen-parent-100").delay(500).queue(function(){$(this).addClass("hide").dequeue()}),$(".error-msg").addClass("hide"),$(".error").removeClass("error")}function e(){var a=!0;return 0===$(".active-login-view").index()?(a=!1,readerAppHelper.logAppADSEvent("APP_ACTION",{action_name:"BackButton/Tapped",input_value:"",screen_name:"Welcome",action_type:"backButton"})):1===$(".active-login-view").index()?(readerAppHelper.logAppADSEvent("APP_ACTION",{action_name:"BackButton/Tapped",input_value:"",screen_name:"SignIn",action_type:"backButton"}),c()):2===$(".active-login-view").index()&&(readerAppHelper.logAppADSEvent("APP_ACTION",{action_name:"BackButton/Tapped",input_value:"",screen_name:"SignUp",action_type:"backButton"}),d()),$("#landing-screen").css("height","100%"),$(".error-msg").addClass("hide"),$(".error").removeClass("error"),a}var f,g=window.readerAppHelper;document.addEventListener("deviceready",function(){window.cookies&&window.cookies.clear(function(){});try{window.SmartCache&&(window.smartcache_instance=window.smartcache_instance||new window.SmartCache,window.smartcache_instance.clear_namespace("user",{cachesuccess:function(){console.log("Cleared user cache!")},cachefailure:function(){console.log("Failed to clear user cache!")}}))}catch(a){console.log("Failed to clear user cache!")}window.readerAppHelper.backButtonHandler=e},!1),-1!==window.location.search.substr(1).indexOf("signout=true")&&(window.cookies&&window.cookies.clear(function(){}),g.logout(function(){$("#message").removeClass("hide").html("You are now signed out.")})),a()}();