define(["services/ck12.locationService"],function(a){"use strict";function b(){function a(a,b){var c=document.getElementById(a),f={types:["(regions)"],componentRestrictions:{}};b&&(f.componentRestrictions={country:b});var g=new google.maps.places.Autocomplete(c,f);google.maps.event.addListener(g,"place_changed",function(){e={};var a=g.getPlace();if("address_components"in a){for(var b=a.address_components,c=0;c<b.length;c++){var f=b[c];-1===f.types.indexOf("administrative_area_level_2")||e.city||(e.city=f.long_name),-1===f.types.indexOf("locality")&&(-1!==f.types.indexOf("locality")||-1===f.types.indexOf("sublocality"))||e.city||(e.city=f.long_name),-1!==f.types.indexOf("postal_code")&&(e.zip=f.long_name),-1!==f.types.indexOf("administrative_area_level_1")&&(e.state=f.short_name,e.province=f.long_name),-1!==f.types.indexOf("country")&&(e.country=f.short_name+": "+f.long_name)}if(!jQuery.isEmptyObject(e)&&"city"in e&&"country"in e)d&&d(e);else{var h="Could not determine address";alert(h)}}})}function b(){return e}function c(a){d=a}var d,e={};this.load=a,this.getUserLocation=b,this.setLocationChangedCallback=c}return new b});