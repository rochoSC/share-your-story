var CONSTANTS = {};
CONSTANTS.API_PROTOCOL = "http";
CONSTANTS.API_HOST = "csc656-jivfur.c9users.io";
CONSTANTS.API_PORT = "8081";
CONSTANTS.API_BASE_URL = CONSTANTS.API_PROTOCOL + "://" + CONSTANTS.API_HOST + ":" + CONSTANTS.API_PORT + "/";
CONSTANTS.VIDEO_FRAME_MAX_SECS = 5;

CONSTANTS.AVAILABLE_EFFECTS = [{
  name: "Grayscale",
  value: "grayscale(100%)"
},{
  name: "Sepia",
  value: "sepia(100%)"
},{
  name: "Contrast",
  value: "contrast(150%)"
},{
  name: "Saturate",
  value: "saturate(50%)"
}];

function printError(jqXHR, textStatus, errorThrown){
   alert('An error occurred... Look at the console (F12 or Ctrl+Shift+I, Console tab) for more information!');
                $('#result').html('<p>status code: '+jqXHR.status+'</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>'+jqXHR.responseText + '</div>');
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('errorThrown:');
                console.log(errorThrown);
}
