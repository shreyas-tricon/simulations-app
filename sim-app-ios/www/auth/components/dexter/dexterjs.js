(function( global, factory ) {
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "dexterjs requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
var isPlainObject = function(object) {
        // not object, not dom el, not window
        if (typeof object !== "object" || object.nodeType || (object !== null && object === object.window)) {
            return false;
        }   
        if (object.constructor && !object.hasOwnProperty.call(object.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
        return true;
    };


var isArray = Array.isArray;



    // adapted from jquery's extend method
    var extend = function extend () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            // skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object") {
            target = {};
        }

        /* jshint ignore:start */
        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];

                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = extend( deep, clone, copy );

                    // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        /* jshint ignore:end */

        // Return the modified object
        return target;
    };
var default_configuration = {
        // TODO: configurable callbacks for onload, onunload, and logEvent

        // mixins are automatically added to the payload parameter of the request body
        mixins: {
            timestamp: null,
            hash: null,
            pageViewData: null,
            resWidth : screen.width,
            resHeight : screen.height,
            device : (window.device) ? window.device.name : "",
            url_referrer : document.referrer
        },
        // clientID is a mixin, but it is not included in the 'payload' parameter of the request body
        clientID: null,
        

        // NON-MIXIN CONFIG
        // These details are used for both cookie as well as localStorage
        // NOTE: cookies' "expire" was deprecated and replaced by
        // max-age, which specifies the seconds before a cookie is nom-nom'd.
        clientStorage: {
            session: {
                name        : "dexterjsSessionID",
                value       : null,
                domain      : ".ck12.org",
                path        : "/",
                "max-age"   : (60 * 30 ), // units are in seconds
                secure      : false
            }, 
            visitor: {
                name        : "dexterjsVisitorID",
                value       : null,
                domain      : ".ck12.org",
                path        : "/",
                "max-age"   : (180 * 24 * 60 * 60 ), // units are in seconds !!!
                secure      : false
            },
        },

        events: {
            timeSpent: "FBS_TIMESPENT"
        },


        apis: {
            recordEvent: (document.location.protocol+"//"+document.location.host+"/dexter/record/event"),
            recordEventBulk: (document.location.protocol+"//"+document.location.host+"/dexter/record/event/bulk"),
            recordEventBulkZip: (document.location.protocol+"//"+document.location.host+"/dexter/record/event/bulk/zip")
        },

        requireUserSignIn: true,
    
        noQueue: false,

        trackPageTime: true,

        trackScreenResolution: true,

        trackReferrer : true,

        // DEXTER QUEUE CONFIG
        dexterQueueName: "dexter",

        // automatically call ajax after each queue push
        dexterQueueAutoFlush: false,

        //Declarative instrumentation plugin
        declarativePlugin: {
            "enabled": false,               // disabled by default
            "defaultDomEvent": "click",     // by default look for click events only
            "additionalDomEvents": "",    // all other types of dom event. For these element attribute domEvent needs to match
            "selector": ".dxtrack",         // selector of the elements to instrument
            "dataPrefix": "data-dx-"        // prefix for data attributes that include the payload
        }

    };

var cloneObject = function cloneObject(object) {
        try {
            var newObj = {};
            var key;
            for (key in object) if (object.hasOwnProperty(key)) {
                if (typeof object[key] === "object" && object[key] !== null) {
                    newObj[key] = cloneObject(object[key]);
                }
                else {
                    newObj[key] = object[key];
                }
            }
            return newObj;
        } catch(error) {
            console.log(error);
            throw new Error("Circular Objects Not Supported");
        }
    };



    /**
     * Initialize dexterjs, merge the config with the defaults.
     * @param - mixin for default_configuration.
     * @returns {function} - The constructor function
     */
    // TODO: refactor the data object creation process.
    var initialize = function(configuration) {
        /** @private */
        configuration = (typeof configuration === "object") ? configuration : {};

        // Done with cherrypicking and extending mixins

        // ==========================================================================================

        /** @constructor */
        var _init = function() {
            var config = extend(true, {}, default_configuration);
            // Can't just extend the default config... we have a 'mixins' property on the 
            // default_configuration. Let's cherrypick items from configuration and check if
            // they match a key in the default_configuration.mixins object. If there's a match, 
            // then extend the mixins -- not the entire object. 
            (function extendConfiguration() {
                var userMixins = null;
                var matchedMixins = [];
                var keyC, keyM;
                var foundMixins = {};
                var mixins = {};
                var len, i;

                // if user defined a mixins object already, then clone it.
                if (configuration.mixins) {
                    userMixins = cloneObject(configuration.mixins);    
                    //delete configuration.mixins;
                }
                // linear search O(n^2) ... 
                for (keyC in configuration) if (configuration.hasOwnProperty(keyC)) {
                    for (keyM in config.mixins) if (config.mixins.hasOwnProperty(keyM)) {
                        if (keyM === keyC) {
                            matchedMixins.push(keyM);
                            break;
                        }
                    }
                }
                for (i=0, len=matchedMixins.length; i<len; i++) {
                    foundMixins[matchedMixins[i]] = configuration[matchedMixins[i]];
                    //delete configuration[matchedMixins[i]];
                }
                extend(true, mixins, cloneObject(foundMixins));
                configuration.mixins = mixins;
                if (userMixins !== null) {
                    extend(true, configuration.mixins, userMixins); 
                }
                extend(true, config, configuration);
            })();
            // NOTE: This is the major data object that is protected by the get and set methods.
            /** @private */
            var data = {
                config:config,
                dexterjsPageStartTime:null
            };
            var buff;

            this.get = function(key) {
                var value = null;
                var result;
                if (key === undefined) {
                    // handy for development, but bad practice in general, 
                    // don't return the entire config object if the user doesn't pass a key.
                    //return extend(true, {}, data);
                    return null;
                } else {
                    buff = key.indexOf(":");
                    if (buff !== -1) {
                        value = data[key.substr(0, buff)][key.substr(buff+1)];
                    } else {
                        value = data[key];
                    }
                    // don't return object references
                    if (typeof value === "object") {
                        result = {};
                        dexterjs.extend(result, value);
                    } else {
                        result = value;
                    }
                    return value;
                }
            };
            // TODO: you can specify the key as "key1:key2" if you expect key1 to be an object.
            // But this should be abstracted so you can do "key1:key2:...:keyn"
            this.set = function(key, val) {
                if (arguments.length === 0) { return undefined; }
                var extendKey = (typeof val === "object")
                val = extendKey ? cloneObject(val) : val;
                buff = key.indexOf(":");
                if (buff !== -1) {
                    data[key.substr(0, buff)][key.substr(buff+1)] = val;
                }
                else if (extendKey) {
                    extend(true, data[key], val);
                }
                else {
                    data[key] = val;
                }
                var configEvent = document.createEvent('Event');
                configEvent.initEvent('dexterjsConfigChangedEvent', true, true);
                configEvent.data = data;
                document.dispatchEvent(configEvent);
                return null;
            };
        };
        _init.prototype = dexterjs.prototype;
        return _init;
    };
var dexterQueue = function dexterQueue(global) {
        var dexter; // reserved for output of dexterjs
        var config; // reserved for dexter.get();
        var dexterQueueName = default_configuration.dexterQueueName;
        global = (global) ? global : (window || this);
        var queue = global[dexterQueueName] || [];

        // Terminal condition.. user defined object isn't an array
        if (!(queue instanceof Array)) {
            console.error(dexterQueueName+" isn't an array");
            return false;
        }
        // See if queue has a config object on it
        if (queue.hasOwnProperty("config")) {
            for (var c in queue.config) {
                dexterjs.set("config:"+c, queue.config[c]);
            }
            dexter = dexterjs(queue.config);
        }
        else {
            dexter = dexterjs();
        }
        // TESTS COMPLETE!

        extend(true, queue, dexter);

        config = dexter.get("config");

        queue.autoFlush = config.dexterQueueAutoFlush;
        
        /**
         * @method - push events onto the queue
         */
        queue.push = function() {
            Array.prototype.push.apply(this, arguments);
            if (this.autoFlush) {
                this.flush();
            }
        };

        /**
         * Clear queue, send all events to dexter backend
         * TODO: bulk upload
         */
        queue.flush = function() {
            var event;
            while (this.length) {
                event = this.pop();
                this.logEvent(event.eventName, event.payload);
            }
        };

        global[dexterQueueName] = queue;

        return queue;
    };


var getCookie = function getCookie(c_name) {
        var i,x,y,ARRcookies=document.cookie.split(";");
        var l=ARRcookies.length;
        for (i=0;i<l;i++){
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x===c_name) {
                // NOTE: the unescape function was deprecated in ECMA v3
                return decodeURIComponent(y);
            }
        }
        return null;
    };

var getRandomString = function getRandomString(length) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', value = '';
        for (var i = length; i > 0; --i) {
            value += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return value;
    };

var xmlhttp = function() {
        try {
            return new XMLHttpRequest();
        } catch (error) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (error2) {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }
        } 
    };

var buildParams = function buildParams( prefix, obj, add ) {
        var name;
        var rbracket = /\[\]$/;
        var buff = "";

        if ( isArray( obj ) ) {
            // DEPRECATED, instead of serializing the array elements the way jQuery does it, 
            // we will stringify each element and comma seperate the elements. Finally, we 
            // wrap the stringified elements with brackets and pass it as an argument to buildParams
            /* 
            // Serialize array item.
            obj.forEach(function(v, i) {
                if ( rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );
                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, add );
                }
            });
            */
            obj.forEach(function(el, idx, self) {
                buff += JSON.stringify(el);
                if (idx !== self.length-1) {
                    buff += ",";
                }
            });
            buildParams( prefix, "[" + buff + "]", add );

        } else if ( typeof obj === "object" ) {
            // Serialize object item.
            for ( name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], add );
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    };

var serialize = function serialize ( a ) {
        var r20 = /%20/g,
            prefix,
            s = [],
            add = function( key, value ) {
                /* jshint ignore:start */
                // If value is a function, invoke it and return its value
                value = (typeof value === "function") ? value() : ( value == null ? "" : value );
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
                //  double url encode a single quote; dexter backend throws errors on sending 
                //  single quotes and %27, so we encodeURLComponent the "%27" to obtain "%2527"
                s[ s.length - 1 ] = s[ s.length - 1 ].replace(/'/g, "%2527");
                /* jshint ignore:end */
            };

            // encode params recursively.
            for ( prefix in a ) {
                buildParams( prefix, a[ prefix ], add );
            }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    };

var post = function post(url, postData, config) {
        var xhr = xmlhttp();
        var buffer;
        var dummyF = function() { return null; };
        var DEFAULTS = {
            success:dummyF,
            error: dummyF,
            headers: { 
                // default form urlencoded type
                "Content-Type" : "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };
        config = (config === undefined) ? { } : config;
        config = extend(true, DEFAULTS, config);

        xhr.open("POST", url);
        for (buffer in config.headers) {
            xhr.setRequestHeader(buffer, config.headers[buffer]);
        }

        // TODO: may need to handle special server codes in the future
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ( xhr.status === 200 || xhr.status === 304 ) {
                    config.success();
                } else if (xhr.status === 0) {
                    config.offline();
                } else {
                    config.error();
                }
            }
        };

        if (config.headers["Content-Type"] === "application/json") {
            xhr.send(JSON.stringify(postData));
        }
        else {
            xhr.send(serialize(postData));
        }
    };


var bakeCookie = function bakeCookie(ingreedients, cookieValue) {
        ingreedients = (typeof ingreedients === "string") ? {name:ingreedients} : ingreedients;
        if (!ingreedients) { throw new Error("Unknown Cookie!"); }
        var cookie = "";
        cookie += ingreedients.name + "=" + (ingreedients.value || cookieValue || getRandomString(25)) + ";";
        cookie += "domain="               + (ingreedients.domain || window.location.host)+ ";";
        cookie += "path="                 + (ingreedients.path || "/") + ";";
        cookie += "max-age="              + (ingreedients["max-age"] || "session")  + ";";
        if (ingreedients.secure) {
            cookie += "secure;";
        }
        return cookie;
    };

var idStorage = (function(){
            var config = default_configuration;
            var useCookies = (document.location.protocol.indexOf("http") !== -1) ? true : false;
            
            /** @private */
            function saveId(type,id) {
                if (useCookies){
                    document.cookie = bakeCookie(config.clientStorage[type], id);
                } else {
                    localStorage[config.clientStorage[type].name] = JSON.stringify({
                        "id" : id,
                        "expiry" : new Date().getTime() + config.clientStorage[type]["max-age"]*1000 
                    });
                }
            };

            /** @private */
            function getIdFromLocalStorage(key) {
                var currentTime = new Date().getTime();
                try {
                    var storedObj = JSON.parse(localStorage[key]);
                    if (storedObj && (storedObj.expiry > currentTime)){
                        return storedObj.id;
                    }
                } catch (e){
                    console.debug("Invalid JSON stored in localStorage");
                }
                
            };

            /** @private */
            function getId(type){
                var id;
                if (useCookies){
                    id = getCookie(config.clientStorage[type].name);
                } else {
                    id = getIdFromLocalStorage(config.clientStorage[type].name);
                }
                id = id || generateAndStoreId(type);
                return id;
            };

            /** @private */
            function generateAndStoreId(type){
                var id = getRandomString(25);
                saveId(type,id);
                return id;
            };

            function getVisitorId(){
                return getId("visitor");
            };

            function getSessionId(){
                return getId("session");
            };

            function updateIdExpiry(){
                    saveId("session",getSessionId());
                    saveId("visitor",getVisitorId());
            };

            return {
                "getVisitorId" : getVisitorId,
                "getSessionId" : getSessionId,
                "updateIdExpiry" : updateIdExpiry
            };
    })();
    


var connectivityManager = (function(){
            var isOnlineFlag = window.navigator.onLine;
            var onlineCallbacks = [];
            var offlineCallbacks = [];
            
            function goOnline(){
                isOnlineFlag = true;
                for (var i=0;i<onlineCallbacks.length;i++){
                    onlineCallbacks[i].apply(this);
                }
            };

            function goOffline(){
                isOnlineFlag = false;
                for (var i=0;i<offlineCallbacks.length;i++){
                    offlineCallbacks[i].apply(this);
                }
            };

            function triggerOnlineEvent(){
                goOnline();
            }

            function addOnOnlineCallback(cb){
                onlineCallbacks.push(cb);
            };

            function addOnOfflineCallback(cb){
                offlineCallbacks.push(cb);
            };

            function isOnline(){
                return isOnlineFlag;
            };


            if (window.addEventListener) {
                window.addEventListener("online", goOnline, false);
                window.addEventListener("offline", goOffline, false);
            }
            else {
                document.body.ononline = goOnline;
                document.body.onoffline = goOffline;
            }

            return {
                "isOnline" : isOnline,
                "addOnOnlineCallback" : addOnOnlineCallback,
                "addOnOfflineCallback" : addOnOfflineCallback,
                "goOffline" : goOffline,
                "triggerOnlineEvent" : triggerOnlineEvent
            };
    })();
    


var logEvent = function logEvent(eventType, payload, callback) {
            var data        = this.get("config");
            var _mixins     = cloneObject(data.mixins);
            var paramData   = {};
            var apis        = data.apis;
            var param       = null;
            var bulkPayload = null;
            var clientID    = _mixins.clientID || data.clientID;
            var postConfig  = {};
            var buffer      = typeof callback;

            if ( buffer === "function" ) {
                postConfig.success = callback;
            } 
            else if ( buffer === "object" ) {
                extend(true, postConfig, callback);
            }

            postConfig.offline = function(xhr){
                connectivityManager.goOffline();
            };

            // REQUIRED CONFIGURATIONS
            if (typeof eventType !== "string") {
                // special case: eventType is a list of events
                if (eventType instanceof Array) {
                    payload = eventType;
                }
                else { throw new Error("[dexterjs:error] eventType isn't a string"); }
            }
            else {
                payload = (payload === undefined) ? {} : payload;
            }
            if (!clientID) {
                throw new Error("Required clientID is missing.");
            }
            // TODO: DEPRECATE
            // Set guest memberID if memberID not available. Allow null override.
            // TODO: client should set the memberID, this is just a fallback because
            // we may still have window.ads_userid in some places...
            if (payload.memberID !== null) {
                _mixins.memberID = window.ads_userid || data.memberID;
            }
            try {
                var memberIDInt = parseInt(_mixins.memberID);
            } catch (error) {
                throw "INVALID MEMBER ID";
            }
            _mixins.memberID = memberIDInt; // memberID should be an integer always
            // ADD sessionID and visitorID to the _mixins object
            _mixins.sessionID = idStorage.getSessionId();
            _mixins.visitorID = idStorage.getVisitorId();
            // we'll be sending the _mixins object; extend it with user's payload.
            extend(true, _mixins, payload);

            /* jshint ignore:start */ // Don't send null or undefined parameters
            for (param in _mixins) if (_mixins.hasOwnProperty(param) && _mixins[param] == null) {
                delete _mixins[param];
            }
            /* jshint ignore:end */

            // support for pageViewData, which should be either an object or function that returns an
            // object with relevant data about the page. If it's a function, then it will be executed, 
            // and the output will be passed to the server.
            // In either case (function/object) the _mixins are extended by the results.
            buffer = typeof _mixins.pageViewData;
            if (buffer === "function") {
                extend(true, _mixins, _mixins.pageViewData());
            } else if (buffer === "object") {
                console.debug("Consider adding these values directly to the mixins object.");
                extend(true, _mixins, _mixins.pageViewData);
            }

            // Support for bulk upload: 
            if ((payload instanceof Array)) {
                bulkPayload = {};
                bulkPayload.clientID = clientID;
                // format the list of events
                payload.forEach(function(event, idx, self) {
                    if (event.clientID) {
                        delete event.clientID;
                    }
                    if (event.eventType) {
                        event.eventType = event.eventType.toUpperCase();
                    }
                    else {
                        throw new Error("Bulk upload requires events to contain eventType parameter");
                    }
                });
                bulkPayload.events = payload;
                if (connectivityManager.isOnline()){
                    post(apis.recordEventBulk, bulkPayload, postConfig);
                } else {
                    dexterjs.storage.append("queue",bulkPayload);
                }
                
            }
            else {
                paramData.eventType = eventType.toUpperCase(); // SET EVENT NAME
                paramData.clientID  = clientID;
                paramData.payload   = JSON.stringify(_mixins);
                if (!payload.timestamp) {
                    payload.timestamp = new Date().toISOString();
                }
                if (connectivityManager.isOnline()){
                    post(apis.recordEvent, paramData, postConfig); // Call the ADS API to record the event.
                } else {
                    dexterjs.storage.append("queue",paramData);
                }
                
            }
            return true;
        };
         


    
    var ajax = {
        logEvent:logEvent
    };

    /**
     * @constructor 
     * @param dexterjs - This is the user's instance of dexterjs.
     */
    function userEvents(dexterjs) {
        var _events = {
            logEvent: ajax.logEvent
        };
        return _events;
    }


    /** @private */
    function startPageTimer() {
        dexterjs.set("dexterjsPageStartTime", new Date().getTime()); 
    }

    // Old online callback    
    // /** @private */
    // function onlineCallback(){
    //     var events = dexterjs.storage.read();
    //     if (events.queue && events.queue.length > 0){
    //         setTimeout(function(){
    //             dexterjs.logEvent.call(dexterjs,events.queue,null,function(){
    //                 console.debug("Saved offline events to server");
    //                 dexterjs.storage.dump();
    //             });
    //         },500);
    //     }
    // };


    /** @private */
    function onlineCallback(){
        batchLogEventCall();
    };

    /** @private */
    function batchLogEventCall(){
        var batchSize = 100;
        var events = dexterjs.storage.read();
        if (events.queue && events.queue.length > 0) {
            if ( events.queue.length > batchSize ) {
                var eventBatch = events.queue.slice(0,batchSize);
                var pendingEvents = events.queue.slice(batchSize, events.queue.length);
                setTimeout(function(){
                    dexterjs.logEvent.call(dexterjs,eventBatch,null,function(){
                        console.debug("Saved " + batchSize + " offline events to server");
                        // dexterjs.storage.dump();
                        dexterjs.storage.write("queue", pendingEvents);
                        batchLogEventCall();
                    });
                }, 500);
            } else {
                setTimeout(function(){
                    dexterjs.logEvent.call(dexterjs,events.queue,null,function(){
                        console.debug("Dumped all offline events to server");
                        dexterjs.storage.dump();
                    });
                },500);
            }
        }
    };

    /** @private */
    function dexterjsLogPageTime() {
        var dexterjsPageStartTime = dexterjs.get("dexterjsPageStartTime");
        var config = dexterjs.get("config");
        // return early if the user sets trackPageTime to a falsy value
        if (!config.trackPageTime) { return false; }
        var endTime = new Date().getTime();
        var timeOnPage = Math.round((endTime - dexterjsPageStartTime)/1000);
        //pageType, URL, memberID, sessionID (cookie with a shorter expiration time), visitorID (cookie with a longer expiration time), duration (in seconds)
        var payload = {
            "URL" : document.location.href,
            //TODO: abstract this userid
            "memberID": window.ads_userid,
            "sessionID": idStorage.getSessionId(),
            "visitorID": idStorage.getVisitorId(),
            "duration": timeOnPage
        };

        // TODO: support legacy while also supporting configurable options 
        if (window.adsPage) {
            payload.pageType = window.adsPage;
        } 
        else if (window.pageType) {
            payload.pageType = window.pageType;
        }
        if (window.adsSubject) {
            payload.subject = window.adsSubject;
        }
        if (window.adsBranch) {
            payload.branch = window.adsBranch;
        }
        if (window.adsContextEid) {
            payload.context_eid = window.adsContextEid;
        } 

        // LOG EVENT
        dexterjs.logEvent(config.events.timeSpent, payload);
     }


    /**
     * Events defined for the dexterjs factory
     * @factory
     */
    function factoryEvents (dexterjs) {
        var _events = {
            dexterjsOnload: function() {
               startPageTimer();
               idStorage.updateIdExpiry();
               if (connectivityManager.isOnline()){
                    onlineCallback();
               }
            },

            dexterjsOnBeforeUnload: function() {
                dexterjsLogPageTime();
            },

            onlineCallback: function() {
                onlineCallback();
            },

            logEvent: ajax.logEvent
        };

        return _events;

    }


    var events = {
        userEvents: userEvents,
        factoryEvents: factoryEvents
    };


    /**
     * Interface object for browser's localStorage
     */
    function LocalStorageInterface (config) {
        var dbName = config.db.name;

        /**
         * Save the argument to the dbName in localStorage
         */
        this.write = function(string) {
            localStorage[dbName] = string;
        };

        /**
         * Read a key's value from the localStorage
         * @returns Object or null. If the dbName points to an undefined location, then return null.
         */
        this.read = function() {
            if (undefined === localStorage[dbName]) { return null; }
            else {
                return localStorage[dbName];
            }
        };

        /**
         * @method
         * delete all data in the db 
         */
        this.dump = function() {
            delete localStorage[config.db.name];
        };
    }



    /**
     * An interface is an instantiable object that handles reads/writes to some 
     * type of DB. The idea is very similar to a java interface,
     * which has been implemented by a class.
     *
     * An interface is expected to implement the following methods:
     *
     * read
     * write
     * dump
     *
     * 
     * ---- method signatures ----
     *
     * read() 
     *      - returns the entire contents of the config.db.name, or null.
     * write(string) 
     *      - returns undefined
     * dump()
     *      - returns undefined
     *
     */

    /**
     * Driver class for saving data to a browser storage database. 
     *
     * This constructor will instantiate the proper INTERFACE. The interface should
     * implement methods (such as 'read', 'write', and 'dump') and handle manipulations to  
     * the database that it is implementing. For example, LocalStorageInterface implements 
     * the 'read' method, which 
     * Given some db.name, this constructor will use the instantiated interface, parse the 
     * existing db field as JSON, and cache the result as a local js object.
     *
     *
     * @constructor
     * @param {object} config - configuration object which extends or overwrites the defaults.
     */
    function Storage(config) {
        var interface = null;
        var model = {};
        var _old; // detect whether the cached model is out of sync with the db writes.
        config = (typeof config !== "object") ? {} : config;
        // extend default config with some user defined config object.
        config = extend(true, {
            "db": {
                "name": "dexterjs",
                "type": "localStorage"
            },
            "model": {
                "queue": []
            },
            "interface": "localStorage"
        }, config);


        // SETUP THE INTERFACE TO THE STORAGE OBJECT
        switch (config.interface) {
            default: 
                interface = new LocalStorageInterface(config);
        }

        /** 
         * @private 
         */
        function initialize () {
            this.read();
            model = extend(true, config.model, model);
            _old = false;
        }

        // warning, objects are passed by reference.
        this.set = function(key, val) {
            model[key] = val;
            _old = true;
        };

        this.get = function(key) {
            return model[key];
        };

        /**
         * @method
         * Write to storage via interface
         */
        this.save = function() {
            _old = false;
            interface.write( JSON.stringify(model) );
        };

        /** 
         * @method
         * Get interface string, parse it as JSON, and save the result as a local JS variable
         */
        this.read = function() {
            var buff = interface.read();
            if (buff === null) {
                return model;
            }
            else {
                model = JSON.parse(buff);
                return model;
            }
        };

        /**
         * Write key:value to the cached model and interface
         * Special Case: no arguments just causes a save.
         * @param {string} key points to the key in the db.
         * @param {string} value is the value associated with the key.
         */
        this.write = function() {
            if (arguments.length===0) { return this.save(); }
            this.set.apply(this, arguments);
            this.save();
        };

        /**
         * Append a value to the given data object specified by key.
         * If the key is undefined, then do a write. 
         * This method is intended to concatenate an existing array with a new array, but 
         * has fallbacks in case the value isn't really an array so the data isn't lost.
         * @method
         */
        this.append = function(key, value) {
            var _v = this.get(key);
            var _vt = typeof _v;

            // check if existing value is NOT an object
            if (_vt !== "object" || _vt === "undefined" || _vt === "boolean") {
                this.write.apply(this, arguments);
            }
            // the existing value could be an array...
            else if (_v instanceof Array ) {
                if (value instanceof Array) {
                    this.write(key, _v.concat(value)); // maintains a single array
                }
                else { 
                    // otherwise, just push the new object onto the existing array
                    _v.push(value);
                    this.write(key, _v); 
                }
            }
            // the existing value must be some object. In this case it's awkward to "append" an object
            // to another object, 
            else {
                console.warn("[Dexterjs] The value passed is an object literal!\nUsing the extend method instead of append.");
                this.extend(key, value);
            }
        };

        /**
         * Given a key that points to an object and a value that is an object, extend the existing objct
         * with the new value.
         * @method
         */
        this.extend = function(key, value) {
            this.write( key, extend(true, this.get(key), value) );
        };

        /**
         * Given a key that points to an integer (possible string), add 1 to the value and set the updated key
         * @method
         */
        this.increment = function(key) {
            this.set(key, parseInt(this.get(key)) + 1);
        };

        /**
         * DELETE ALL DATA IN THE INTERFACE !!!
         * DELETE CACHED STORAGE OBJECT!!!
         * @method
         */
        this.dump = function() {
            model = {};
            model = extend(true, config.model, model);
            interface.dump();
        };

        initialize.call(this);
    }

    function polyfils() {
        /**
         * Handle missing console
         */
        if (!window.console) {
            window.console = {};
            window.console.log = window.console.warn = window.console.debug = function() {};
        }
    }

    "use strict";
    /**
     *An plugin to instrument dexter events declaratively using data attributes. Disabled by default.
     *You will need to enable using the configuration
     *
     *<b>Default config</b>:
     *  enabled - false
     *  defaultDomEvent - 'click'. see notes.
     *  additionalDomEvents - Empty. Allows capturing other dom events in addition to the defaultDomEvent. See notes.
     *  selector - Looks for 'dxtrack' class on elements to be tracked
     *  dataPrefix - picks all the data attributes that start with "data-dx-"
     *
     * Notes: 
     * 1. 'defaultDomEvent' should be a single event. 
     * 2. The 'additionalDomEvents' should be a comma separated list of dom events. The dexterjs event will only be fired
     * if the elements "domEvent" attribute matches one of these events.
     * 3. The 'additionalDomEvents' config should be a superset i.e should include ALL the values you plan to use in the 'domEvent'
     * attribute of the elements.   
     * 4. All the events are attached to document object. So only the events that can be attached to document can be used 
     * with declarativePlugin.
     *
     *  
     *<b>Overide config</b>
     *You can overide the default config when you initialize dexterjs, by passing in the declarativePlugin
     *config with rest of your config
     *
     *      dexterjs.set("config", {
     *          clientID: "XXXXXX",
     *          trackPageTime: false,
     *          declarativePlugin: {
     *              enabled: true,
     *              defaultDomEvent: "touchstart",
     *              additionalDomEvents: "click,touchend",
     *              selector: ".dxtrack, .dxtrack2",
     *              dataPrefix: "data-dx"
     *          }
     *      });
     *
     *
     *<b>Examples</b>
     *
     *      Passing individual key:value pairs for payload
     *      <a class="dxtrack" data-dx-eventname="eventname" data-dx-key1="value1" data-dx-key2="value2">Link</a>
     *
     *      Passing payload as a single attribute
     *      <a class="dxtrack" data-dx-eventname="eventname" data-dx-payload='{"key1":"value1", "key2":"value2"}'>Link</a>
     *
     *      Combining individual key:value with payload. In this case the payload will be {"key1":"value1","key2":"value2"}
     *      <span class="dxtrack" data-dx-eventname="eventname" data-dx-key1="value1" data-dx-payload='{"key2":"value2"}'>something</span>
     *
     *      Specifing domEvent. This event will only fire when touchstart is either the defaultDomEvent OR is specified in the 'additionalDomEvents'
     *      <a class="dxtrack" data-dx-domevent="touchstart" data-dx-eventname="eventname" data-dx-key1="value1" data-dx-key2="value2">Link</a>
     * 
     * @constructor
     * @param {object} dexterjs - dexterjs instance that includes the configuration.
     */
    function Declarative(dexterjs) {
        var config = dexterjs.get("config");
        config = (typeof config !== "object") ? {} : config;
        var documentElement = document.documentElement;
        var cachedPush = Array.prototype.push;
        var matches = documentElement.matches || documentElement.webkitMatchesSelector || documentElement.mozMatchesSelector || documentElement.oMatchesSelector || documentElement.msMatchesSelector;

        /** 
         * @private
         */
        function initialize() {
            initEventListeners();
            //listen for any dexterjs config changes. Normally this will happen
            //when initiliazing dexterjs using dexterjs.set()

            //Remove any previous listener. Less likely for this to happen
            document.removeEventListener("dexterjsConfigChangedEvent", configChangeListener);
            //Listen for dexter config changes 
            document.addEventListener("dexterjsConfigChangedEvent", configChangeListener);
        }

        /**
         *@private
         */
        function configChangeListener(event) {
            config = extend(true, config, event.data.config);
            initEventListeners();
        }

        /**
         * @private
         */
        function handleDelegate(element, event, dataPrefix) {
            var payload = {};
            //if domEvent attribute is specified on element, it should match the current event
            //if not, the current event should match the defaultDomEvent
            var domEvent = element.getAttribute(dataPrefix + "domEvent");
            if ((domEvent && event.type !== domEvent) || (event.type !== config.declarativePlugin.defaultDomEvent)) {
                //do not process this event 
                return;
            }

            //first get the eventName attribute and bail out if absent
            var eventName = element.getAttribute(dataPrefix + "eventname");
            if (!eventName || eventName === "") {
                return;
            }

            //can't use element.dataset due to lack of IE support, instead loop attributes
            //and get the needed payload
            var attributes = element.attributes;
            for (var j = 0, attrLen = attributes.length; j < attrLen; j++) {
                var data = attributes[j];
                if (data.name.indexOf(dataPrefix) === 0) {
                    var dataName = data.name.replace(dataPrefix, "");
                    if (dataName === "eventname") {
                        //skip eventName data attribute, as we already have it
                        continue;
                    }

                    if (dataName === "payload") {
                        //if the data attribute name is "payload", parse JSON and use that as payload  
                        var jsonPayload = JSON.parse(data.value.replace(/'/g, "\""));
                        payload = extend(true, payload, jsonPayload);
                    } else {
                        payload[dataName] = data.value;
                    }

                }
            }
            dexterjs.logEvent(eventName, payload);
        }

        function delegateListener(event) {
            var elementQuerySelector = config.declarativePlugin.selector;
            var dataPrefix = config.declarativePlugin.dataPrefix;
            var qs = document.querySelector(elementQuerySelector);
            if (qs) {
                var el = event.target;
                var matched = false;

                while (el && !(matched = matches.call(el, elementQuerySelector))) {
                    el = el.parentElement;
                }

                if (matched) {
                    try {
                        handleDelegate(el, event, dataPrefix);
                    } catch (err) {
                        //don't raise exception, to prevent problems in
                        //normal execution, while firing dexterjs events.
                        console.log(err);
                    }
                }
            }
        }


        function delegate(eventType) {
            //remove any previous event handler
            document.removeEventListener(eventType, delegateListener, true);
            //Use the event capturing mode 
            document.addEventListener(eventType, delegateListener, true);
        }

        /**
         * @private
         * Add event listeners
         */
        function initEventListeners() {
            if (config.declarativePlugin.enabled) {
                var events = ["click"]; //default
                var additionalEventStr = null;
                var defaultDomEventStr = config.declarativePlugin.defaultDomEvent;
                if (defaultDomEventStr) {
                    events = [defaultDomEventStr]; //overide default
                }

                additionalEventStr = config.declarativePlugin.additionalDomEvents;
                if (additionalEventStr) {
                    cachedPush.apply(events, additionalEventStr.split(/[\s,]+/));
                }

                for (var i = 0; i < events.length; i++) {
                    delegate(events[i]);
                }
            }
        }


        initialize.call(this);
    }

    "use strict";

    polyfils();
    var storage = null; // for localStorage
    var dexterizedEvents = null; // for events-factory output
    var dexterjs = null;
    var declarative = null; // for declarative instrumentation


    /**
     * Handle all the configurable options that were either passed to 
     * dexterjs or set by default.
     * TODO: this is specifically for factory output.
     */
    function handleConfiguration(dexterjs) {
        var config = dexterjs.get("config");
        if (!config.trackScreenResolution) {
            delete config.mixins.resHeight;
            delete config.mixins.resWidth;
        }
        if (!config.trackReferrer) {
            delete config.mixins.url_referrer;
        }

        //if (config.trackPageTime === true) { }
    }

    // setup storage
    storage = new Storage({type: "localStorage"});

    /** 
     * @factory
     * Define the dexterjs object here
     */
    dexterjs = function(configuration) {
        var Dexter = initialize(configuration);
        var _dexterjs = {};
        extend(true, _dexterjs, new Dexter());

        // handle factory specific preparation here
        handleConfiguration(_dexterjs);
        var _events = events.userEvents(_dexterjs);

        // Configured methods for new dexterjs object
        _dexterjs.logEvent = _events.logEvent;

        return _dexterjs;
    };

    dexterjs.extend = extend;
    dexterjs.storage = storage;

    // extend the factory to include a clone of the default configuration with get and set methods.
    // NOTE: would use the extend method, however it doesn't yet handle functions, and it may not be so 
    // simple to add this functionality because it's a recursive function.
    (function() {
        var DexterConfig = initialize({}); // will initialize with default_configuration
        var dexterConfig = new DexterConfig();
        for (var config in dexterConfig) if (dexterConfig.hasOwnProperty(config)) {
            dexterjs[config] = dexterConfig[config];
        }
    })();

    // Define the prototypes here.
    dexterjs.prototype = {
        constructor: dexterjs,
        extend: extend,
        storage: storage
    };

    // setup the factory events
    dexterizedEvents = events.factoryEvents(dexterjs);
    dexterjs.logEvent = dexterizedEvents.logEvent;

    // bind the beforeunload event
    window.addEventListener("beforeunload", dexterizedEvents.dexterjsOnBeforeUnload);
    window.addEventListener("load", dexterizedEvents.dexterjsOnload);

    // setup Declarative 
    declarative = new Declarative(dexterjs);

    // create an instance of a dexterjs object for the dexterQueue
    dexterQueue(window);

    //add onOnline callback to push events to server
    connectivityManager.addOnOnlineCallback(dexterizedEvents.onlineCallback);


if ( typeof define === "function" && define.amd ) {
    define([], function() {
        return dexterjs;
    });
}




    var _dexterjs = window.dexterjs;


    dexterjs.noConflict = function() {
        if (window.dexterjs === dexterjs ) {
            window.dexterjs = _dexterjs;
        }
        return dexterjs;
    };


    if ( typeof noGlobal === typeof undefined ) {
        window.dexterjs = dexterjs;
    }



    dexterjs.version = "0.1.2";
}));
