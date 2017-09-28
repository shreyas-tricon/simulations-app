define([
    'text!templates/profile.builder.html',
    'text!templates/thankyou-for-signup.html'
],
function(PI,TY){

    /**
     * A collection of all templates used in Practice App
     */
    return {
        'PROFILE_INFO':PI,
        'THANKYOU_SIGNUP':TY
    };
});
