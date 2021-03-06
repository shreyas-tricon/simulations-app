define(['jquery', 'jquery.fileupload', 'jquery.iframe-transport'], function ($) {
        'use strict';

        function imageUploadService(){
            var callbackFunction=null;
            var oldImgSrc = '';
            function fileAdd(e, data) {
                var uploadfile = data.files[0];
                var filename = uploadfile.name;
                if (validateFileType(filename)) {
                    $('#continue_btn').attr({'disabled':'disabled'});
                    $('#resourcePath').hide();
                    oldImgSrc = $('#profileImage').attr('src');
                    $("#ajaxLoadingWait").removeClass('no-display');
                    $("#profileImage").addClass('no-display');
                    data.submit();
                } else {
                    //invalid file extension message goes here
                    alert("Please select a PNG, JPG or GIF image file."); 
                }
            }

            function validateFileType(filename) {
                var filetype_re_str = "jpg|jpeg|png|gif";
                var filetype_re = new RegExp(filetype_re_str, "i");
                return filetype_re.test(filename);
            }
            
            function imageUploadDone(e, data) {
                try {
                    var result = data.result;
                    result=result.substring(result.indexOf('{'),result.lastIndexOf('}')+1);
                    result = $.parseJSON(result);
                    if (result.responseHeader.status !== 0) {
                      alert(result.response.message);
                      $('#profileImage').attr('src', oldImgSrc);
                      $('#profileImage').removeClass('no-display');
                      $('#ajaxLoadingWait').addClass('no-display');
                    } else {
                      var image = result.response;
                      if (image.uri) {
                        if (callbackFunction){
                          callbackFunction(image);
                        } else {
                          $('#profileImage').attr('src',image.uri);
                          $('#profileImage').data('default-image','false');
                          $('#profileImage').removeClass('no-display');
                          $('#ajaxLoadingWait').addClass('no-display');
                        }
                      } else {
                        $('#profileImage').attr('src', oldImgSrc);
                        $('#profileImage').removeClass('no-display');
                        $('#ajaxLoadingWait').addClass('no-display');
                      }
                    }
                    $('#continue_btn').removeAttr('disabled');
                    $('#resourcePath').show();
                  }
                  catch(error){
                    alert('Failure in uploading profile picture. Please try again.');
                    $('#continue_btn').removeAttr('disabled');
                    $('#resourcePath').show();
                    $('#profileImage').attr('src', oldImgSrc);
                  $('#profileImage').removeClass('no-display');
                  $('#ajaxLoadingWait').addClass('no-display');
                  }
                }
            
            function imageUploadProgress(e, data){
                //image upload progress
            }

            function initImageUploader(callback){
                callbackFunction = callback;
                var image_form = $('#frm_imageupload');
                $('#btn_coveredit_apply').addClass('disabled');
                image_form.fileupload({
                    'dataType' : 'html',
                    'add' : fileAdd,
                    'done' : imageUploadDone,
                    'progress': imageUploadProgress
                });
            }

            this.initImageUploader = initImageUploader;
        }

        return new imageUploadService();
});
