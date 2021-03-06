var require = {
      baseUrl: "js",
      paths: {
            jquery: "../components/jquery/jquery",
           // backbone: "../../components/backbone/backbone",
            underscore: "../components/underscore/underscore",
            marionette: "../../components/marionette/lib/core/backbone.marionette",
            requirejs: "../components/require/require",
            text: "../components/require/text",
            "backbone.babysitter": "../../components/backbone.babysitter/lib/backbone.babysitter",
            "backbone.wreqr": "../../components/backbone.wreqr/lib/backbone.wreqr", 
            "jquery.hammer": "../../components/jquery.hammer.js/jquery.hammer",
            dexterjs: "../components/dexter/dexterjs",
            common: "../../ck12-components/common/js",
            foundation: "../../components/foundation/4.1.2/foundation.min",
            profileBuilder:	"controllers/profile.builder",
            ck12LocationService:"services/ck12.locationService",
            ck12ProfileBuilder:"services/ck12.profilebuilder",
            imageUpload:"services/image.upload",
            profilebuilderTemplate:'templates/profile.builder.template',
            app:"app",
            'jquery.ui.widget': '../components/jquery/jquery.ui.widget',
            'jquery.fileupload': '../components/jquery/jquery.fileupload',
            'jquery.iframe-transport': '../components/jquery/jquery.iframe-transport'
      },
      shim: {
           
      },
      packages: [

      ]
};