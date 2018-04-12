var CONSTANTS = {};
CONSTANTS.API_PROTOCOL = "http";
CONSTANTS.API_HOST = "csce656-newmedia-rochosc.c9users.io";
CONSTANTS.API_PORT = "8081";
CONSTANTS.API_BASE_URL = CONSTANTS.API_PROTOCOL + "://" + CONSTANTS.API_HOST + ":" + CONSTANTS.API_PORT + "/";
CONSTANTS.VIDEO_FRAME_MAX_SECS = 5;


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
