// The prod verison of this file exists on https://services1.tmpwebeng.com/custom-imports/custom-imports.js


// // Function to get scripts
// function getScript(source, callback) {
//     var script = document.createElement('script');
//     var prior = document.getElementsByTagName('script')[0];
//     script.async = 1;

//     script.onload = script.onreadystatechange = function( _, isAbort ) {
//         if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
//             script.onload = script.onreadystatechange = null;
//             script = undefined;

//             if(!isAbort) { if(callback) callback(); }
//         }
//     };

//     script.src = source;
//     prior.parentNode.insertBefore(script, prior);
// }

if (!window.jQuery) {
    alert("Jquery needed for this script")
}

// Function to get paramatures often times found in urls after a ?
// Use case:
// getParameter("scripts","www.brock.com/?scripts=charts,inpagenav,inview?no-styles=charts?no-dependencies=inview")
// Expected result: ["charts", "inpagenav", "inview"]
function getParameter(name, source) {
    var regex = new RegExp('[^&?]*?' + name + '=([^&?]*)');
    var results = regex.exec(source);
    var array = results[1].toString().split(',');
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
function matches(name, source) {
    if ( typeof name !== 'undefined' && typeof source !== 'undefined' ) {
        var name = name.toString().toLowerCase();
        var source = source.toString().toLowerCase();
        return (source.indexOf(name) > 0);
    } else {
        return false;
    }
};


// when calling script you tell it what you want to do based on your url parapamaters the main pararamaer is "scripts" wring like "?scripts=charts" 
// if you want to put multiple scripts you can put in a comma like "?scripts=charts,inpagenav,inview"
// By default the script will load dependencies and css


if (typeof qaMpode === 'undefined') {
    var qaMode = "";
}

(function() { // On Document ready

    var url = window.location.href;

    // Check URL and see if it wants qa version or prod
  
    if ( matches("?custom-qa-mode", url) ) {
    
      // Check to make sure a loop is not created with runing the script again
      if ( !matches("true", qaMode) ) {
        // set qaMode to true do it does not load the script again
        qaMode = true;
        // Load the QA version of the custom script loacated on github
        $.getScript("https://tmpworldwide.github.io/custom-imports/build/custom-imports.js", function() {
            alert("Custom Importants QA now loaded");
            customImports();
        });
      }
  
    } else {
      // Set QA mode to false so the script does not run again
      qaMode = false;
      // Run the script as normal
      customImports();
    }
  
  })();  // end on doc ready
  
//
// The function that will call all other functions
//
function customImports() {
    alert("Custom Imports Functoin Run qaMode: " + qaMode);

    console.log("Testing QA Path")
} // End of customImports function