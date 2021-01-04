// The prod verison of this file exists on https://services1.tmpwebeng.com/custom-imports/custom-imports-v1_5.js


// Function to get parameters often times found in urls after a ?
// Use case:
// getParameter("scripts","www.brock.com/?scripts=charts,inpagenav,inview?no-styles=charts?no-dependencies=inview")
// Expected result: ["charts", "inpagenav", "inview"]
function getParameter(name, source) {
    var regex = new RegExp('[^&?]*?' + name + '=([^&?]*)');
    if ( regex.test(source) ) {
        var results = regex.exec(source);
        var array = results[1].toString().split(',');
    } else {
        var array = "";
    }
    return array;
};

// Function to test if object exists
// Use case:
// if ( $('.ClassName').exists() ) { }
jQuery.fn.exists = function(){return ($(this).length > 0);};

// Function to test if string or array have a match
// Use case:
// var fruits = ["Banana", "Orange", "Apple", "Mango"];
// matches("apple", fruits);
// This has a built in default of false if the source is not present
function matches(name, source) {
    if ( typeof name != 'undefined' && typeof source != 'undefined' ) {
        var name = name.toString().toLowerCase();
        var source = source.toString().toLowerCase();
        return (source.indexOf(name) > -1);
    } else {
        return false;
    }
};


// Function to check to see if URL exists and report its status code
// Originally from https://stackoverflow.com/a/3915698/5476295

function UrlExists(url, cb){
    jQuery.ajax({
        url:      url,
        dataType: 'text',
        type:     'GET',
        complete:  function(xhr){
            if(typeof cb === 'function')
            cb.apply(this, [xhr.status]);
        }
    });
}

// PollyFill for CustomEvent so that IE11 runs exactly like the other browsers
// Use Case:
// You setup the event
// var yourFancyEvent = new CustomEvent('yourFancyEvent');
// To run the event on speffici elements
// elem.dispatchEvent('yourFancyEvent');
// or run it on the whole document 
// $(document).trigger('yourFancyEvent');
// You then can listen where it is expected to run
// $(document).on('yourFancyEvent', function (e) { });
(function () {
    if ( typeof window.CustomEvent === "function" ) return false; // Check to make sure CustomEvent is not a function

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

// PollyFill for Includes
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

// Debounce Fundtion
// Use case:
// var myEfficientFn = debounce(function() {
// 	// All the taxing stuff you do
// }, 250);
// $(window).on('resize', myEfficientFn);
// By default this triggers at the end of the event tiggering however 
// If 'immediate' is passed, it will trigger the function on the
// leading edge, instead of the trailing. As seen here
// var rightAwayFn = debounce(function() {
// 	// All the taxing stuff you do
// }, 250, 'immediate');
// $(window).on('resize', rightAwayFn);
function ciDebounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/// Convert something to boolean
function ciToBoolean( o ) {
    if ( null !== o ) {
        var t = typeof o;
        if ( "undefined" !== typeof o ) {
            if ( "string" !== t ) return !!o;
            o = o.toLowerCase().trim();
            return "true" === o || "1" === o;
        }
    }
    return false;
}

// Variable needed to see if QA script has been ran
// This only setups these varibales if they are already empty
if (typeof qaMode === 'undefined') {
    var qaMode = "";
}

// Variable needed to see if Local script has ran 
// This only setups these varibales if they are already empty
if (typeof localMode === 'undefined') {
    var localMode = "";
    var localModePath = "";
}

// Set global vairable for url
var url = window.location.href;

// The following function will determine what version of the script will run
// if there are no additional parameters in the url of thr browser it will load the production version of the script
// if it contains ?custom-local-mode it will load the local version of the script
// if it contains ?custom-qa-mode it will load the qa version of the script
// if it contains ?custom-debug, it will not change what version of the script is running but it will so all the console logs
// if it contains ?custom-local-mode&override-path=http://localhost:61651/tmp-custom-imports/build/ it will load the script from the build path you indicate


function determiningCiMode() { // This function determines which mode the Custom Imports Script loads

    // Check URL and see if it wants qa version or prod

    if ( matches("?custom-qa-mode", url) ) {
    
        // Check variable to make sure it is empty so that a loading script loop does not happen
        if ( qaMode == "" ) {
            // set qaMode to true do it does not load the script again
            qaMode = true;
            localMode = false;
            // Load the QA version of the custom script located on github
            $.getScript("https://tmpworldwide.github.io/tmp-custom-imports/build/custom-imports.js", function() {
                alert("Custom Imports QA Script now loaded");
                customImports();
            });
        }
    } else if ( matches("?custom-local-mode", url) ) {
    
        // Check variable to make sure it is empty so that a loading script loop does not happen
        if ( localMode == "" ) {
            // set qaMode to true do it does not load the script again
            localMode = true;
            qaMode = false;
            // Load the local version of the custom script located on github


            localModePath  = "http://localhost/sites/tmp-custom-imports/build/";
            // Use Case:
            // ?custom-local-mode&override-path=http://localhost:61651/tmp-custom-imports/build/
            if ( matches("&override-path", url) ) {
                localModePath = getParameter("override-path", url)[0];
            }


            $.getScript(localModePath + "custom-imports-v1_5js", function() {
                alert("Custom Imports Local Script now loaded");
                // localModePath = "http://localhost/sites/tmp-custom-imports/build/";
                customImports();
            }).fail(function(){
                // $.getScript(localModePath + "custom-imports.js", function() {
                //     alert("Drew's custom path  for Custom Imports Local Script now loaded");
                //     localModePath = "http://localhost:61651/tmp-custom-imports/build/";
                //     customImports();
                // })
                alert("Custom Imports FAILED TO LOAD");
            });
        }

    } else {
        // Set QA and local mode to false so the script does not run again
        qaMode = false;
        localMode = false;
        // Run the script as normal
        // customImports();
    }

} // END ciMode



        // A developer could locally use 
        $(document).on('ciLoadedAScript', function (e) {

            var scriptName = e.detail.script;
            if( scriptName == "fancybox" ) {
                console.log("Fancybox Triggered")
            }

        })

//
// The function that will call all other functions
//
// function customImports() {
    // In console if url contains ?custom-debug then 
    // print to the console which version of the script is running
    if ( matches("?custom-debug", url) ) {
        if ( qaMode ) {
        console.log("CI Debug - Loading: QA Script")
        } else if ( localMode ) {
            console.log("CI Debug - Loading: Local Script")
        } else {
            console.log("CI Debug - Loading: Prod Custom Imports")
        }
    }

    // Global variable for paths for scripts
    var scriptPath = "https://services1.tmpwebeng.com/custom-imports/";
    if ( qaMode ) {
        scriptPath = "https://tmpworldwide.github.io/tmp-custom-imports/build/";
    } else if ( localMode ) {
        scriptPath = localModePath;
    }

    // Find parameters from the src of script file
    // please note script tag MUST contain ID js-custom-imports

    // when calling script you tell it what you want to do based on your url parameter. The main parameter is "scripts" wring like "?scripts=charts" 
    // if you want to put multiple scripts you can put in a comma like "?scripts=charts,inpagenav,inview"
    // By default the script will load dependencies and css





    /// Check to see if scripts have been loaded outside of CI by checking if they are functioning and also if they have already been added to the scripts list variable


    function isFancyBoxAlreadyLoadedNotViaCutsomImports() {
        var fbInit = false;
        if (typeof $._data(document, 'events') !== 'undefined') {
            $.each($._data(document, 'events').click, function (i, v) {
                if (v.namespace === 'fb-start') fbInit = true;
            });
        }

        if( fbInit == true && !scripts.includes('fancybox')  ) {
            scripts.push("fancybox");
            console.error('CI: Something outside of Custom Imports has loaded Fancy Box')
        }

    }

    isFancyBoxAlreadyLoadedNotViaCutsomImports();



    function isSlickSliderAlreadyLoadedNotViaCutsomImports() {
        var isSlickLoaded = (typeof $.fn.Slick !== 'undefined');

        if ( isSlickLoaded && !scripts.includes('slickslider') ) {
            scripts.push('slickslider');
            console.error('CI: Something outside of Custom Imports has loaded Slick slider')
        }

    }

    isSlickSliderAlreadyLoadedNotViaCutsomImports();





    // function ciLoadFancyBox(params) {
    //     scriptName = "fancybox";

    //     console.log("CI Debug - FancyBox Script Triggered"); 
    //     if( !scripts.includes(scriptName)  ) {
    //         scripts.push(scriptName);

    //         $('head').append( $('<link rel="stylesheet" type="text/css" href="' + scriptPath + "library/fancybox/jquery.fancybox.min.css" + '" />'));
    //         $.getScript( scriptPath + "library/fancybox/jquery.fancybox.min.js", function() {
    //             // if ( matches("?custom-debug", url) ) {
    //                 console.log("CI Debug - Video Script: FancyBox3 Dependancy Loaded")
    //             // }

    //                    // Trigger an event that a developer could listen for
    //     // A developer could locally use $(document).on('hubInitialized', function (e) {})

    //     var ciLoadedAScript = new CustomEvent('ciInitializedAScript', { detail: { 'script': scriptName} } );
    //     document.dispatchEvent(ciLoadedAScript);
        


    //         });


    //     }

    // }


    // function ciLoadAnyScript(scriptName, scriptPath, cssPath) {

    //     console.log("CI Debug - FancyBox Script Triggered"); 
    //     if( !scripts.includes(scriptName)  ) {
    //         scripts.push(scriptName);

    //         $('head').append( $('<link rel="stylesheet" type="text/css" href="' + cssPath + '" />'));
    //         $.getScript( scriptPath , function() {
    //             if ( matches("?custom-debug", url) ) {
    //                 console.log("CI Debug - " scriptName + " Loaded")
    //             }

    //             // Trigger an event that a developer could listen for
    //             // A developer could locally
    //             // $(document).on('ciInitializedAScript', function (e) {
    //             //     var scriptName = e.detail.script;
    //             //     if( scriptName == "fancybox" ) {
    //             //         console.log("Fancybox Triggered")
    //             //     }
    //             // })

    //             var ciLoadedAScript = new CustomEvent('ciInitializedAScript', { detail: { 'script': scriptName} } );
    //             document.dispatchEvent(ciLoadedAScript);
        


    //         });


    //     }

    // }





// } // End of customImports function

// Start the show on the road
determiningCiMode()


var isCiInitialized = false;
var scriptsLoadedByOrDetectedByCustomImports = [];


var ciCustomImports = {
    Init: function(){

    //    var ciLibraryPath = 'http://localhost/sites/tmp-custom-imports/build/library/';
       var ciLibraryPath = 'https://services1.tmpwebeng.com/custom-imports/library/';


            if ( matches("ci-override-path", url) ) {
                ciLibraryPath = getParameter("ci-override-path", url)[0];
                console.log("CI - Path Override " + ciLibraryPath)
            }
            // Use Case:
            // &ci-override-path=http://localhost/sites/tmp-custom-imports/build/library/

        // Look through the page to see if any data-ci-scripts exist
        if ( $('[data-ci-script]').exists() ) { 
            $('[data-ci-script]').each( function () {

                var script = $(this).attr('data-ci-script');

                console.log("CI Debug - data-ci-script = " +  script );

                // data-ci-script="slick"
                if( matches("fancybox", script)   ) {
                    ciCustomImports.loadFancyBox(ciLibraryPath)
                }

                // data-ci-script="slickslider" data-ci-slick-themecss="true"
                if( matches("slickslider", script) ) {
                    var themecss = $(this).attr('data-ci-slick-themecss');
                    // If the setting attribute is not set we are assuming it should be set to true
                    if( typeof themecss == 'undefined' ) {
                        themecss = true;
                    } else {
                        themecss = ciToBoolean(themecss);
                    }

                    console.log('slick theme = ' + themecss)

                    ciCustomImports.loadSlickSlider('https://tbcdn.talentbrew.com/company/3461/shared/js/', themecss);
                }
            });
        }

        ciCustomImports.loadACustomScript('inview', ciLibraryPath + 'inview/inview.js' )

        // Fire event that says Custom Imports has initalized. 
        // A developer could locally
        // $(document).on('ciInitialized', function (e) { });
        if( isCiInitialized === false ) {
            var ciInitialized = new CustomEvent('ciInitialized');
            document.dispatchEvent(ciInitialized);
            isCiInitialized = true;
        }


    },
    loadACustomScript: function(scriptName, scriptPath, cssPath) {

        console.log("CI Debug - LoadACustomScript Triggered - " + scriptName ); 
        if( !scriptsLoadedByOrDetectedByCustomImports.includes(scriptName)  ) {
            scriptsLoadedByOrDetectedByCustomImports.push(scriptName);

            $('head').append( $('<link rel="stylesheet" type="text/css" href="' + cssPath + '" />'));
            $.getScript( scriptPath , function() {
                if ( matches("?custom-debug", url) ) {
                    console.log("CI Debug - " + scriptName + " Loaded")
                }

                // Trigger an event that a developer could listen for
                // A developer could locally
                // $(document).on('ciLoadedAScript', function (e) {
                //     var scriptName = e.detail.script;
                //     if( scriptName == "fancybox" ) {
                //         console.log("Fancybox Triggered")
                //     }
                // })

                var ciLoadedAScript = new CustomEvent('ciLoadedAScript', { detail: { 'script': scriptName} } );
                document.dispatchEvent(ciLoadedAScript);


            });




            

        }

    },
    loadFancyBox: function(ciLibraryPath) {
        var scriptPath = ciLibraryPath + 'fancybox/jquery.fancybox.min.js';
        var cssPath = ciLibraryPath + 'fancybox/jquery.fancybox.min.css';
        
        ciCustomImports.loadACustomScript('fancybox', scriptPath, cssPath );
    },
    loadSlickSlider: function(ciLibraryPath, optionalThemeCSS) {


        var scriptPath = ciLibraryPath + 'slick_v1_8_1/slick-min.js';
        var cssPath = ciLibraryPath + 'slick_v1_8_1/slick.css';
        var themeCssPath = ciLibraryPath + 'slick_v1_8_1/slick-theme.css';
        


        if( !scriptsLoadedByOrDetectedByCustomImports.includes('slickslider')  ) {
            if( optionalThemeCSS )  {
                $('head').append( $('<link rel="stylesheet" type="text/css" href="' + themeCssPath + '" />'));
            }
        }
        
        ciCustomImports.loadACustomScript('slickslider', scriptPath, cssPath )



    }

}

ciCustomImports.Init();