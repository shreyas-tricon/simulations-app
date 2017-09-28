//VERSION FILE
//Values from this file are used to configure iOS
//and android version information
// DO NOT MODIFY UNLESS YOU KNOW WHAT YOU ARE DOING
define([], function(){
    'use strict';
    var MAJOR = '104'; //MAJOR VERSION, only bump this for major releases
    var MINOR = '1'; //MINOR version, used periodically scheduled sprints/releaes
    var PATCH = '0'; //PATCH version, for urgent fixes;
    var versionMajor = '4'
    // DO NOT MODIFY.
    var BUILD = '7379'; //Grunt will replace this value with SVN revision
    return {
        major: MAJOR,
        minor: BUILD,
        version: [MINOR,PATCH,versionMajor,BUILD].join('.')
    };
});
