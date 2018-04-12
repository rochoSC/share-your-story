$(document).ready(function() {
  //This file must be added on every js that uses ajax calls to our API server
  $.getScript("../js/constants.js", function() {
     console.log("Constants file loaded")
  });

  var constraints = {
    audio: true,
    video: {width: {exact: 640}, height: {exact: 480}}
  };
  var video = document.querySelector('#video_recording');//For some reason does not work with jquery selectors
  var webcamstream;
  var mediaRecorder;
  var recordedBlobs = [];
  var recordedTime = 0;
  var recordingElapsedTime = 0;
  var recordingTimeOut;
  var recordingTimer;
  var isRecording = false;
  var isComplete = false;
  //Verify we can actually access the video
  if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    // Good to go!
    console.log("User media found!")
    function handleSuccess(stream) {
      video.srcObject = stream;
      webcamstream = stream;
    }

    function handleError(error) {
      console.error('Error recording video!', error);
      alert("We could not set up the video recording. Make sure you granted rights!");
    }

    //Obtaining the video streaming instance
    function loadStreaming(){
      navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    }
    loadStreaming();

    $("#rec_button").click(function(){

      video.muted = true;
      console.log('Clicked rec');
      startRecording();
    });

    $("#stop_button").click(function(){
      video.muted = true;
      console.log('Clicked stop');
      clearTimeout(recordingTimeOut);
      clearInterval(recordingTimer);
      stopRecording();
    });

    $("#play_button").click(function(){
      console.log('Clicked play');
      if (recordedBlobs.length > 0){
        var superBuffer = new Blob(recordedBlobs, {type: "video/webm"});
        video.srcObject = null;
        video.src = window.URL.createObjectURL(superBuffer);
        video.muted = false;
      }
    }).prop('disabled', true);

    $("#submit_fragment_button").click(function(){
      console.log('Submitting');
      var superBuffer = new Blob(recordedBlobs, {type: "video/webm"});
      var fd = new FormData();
      fd.append("file_name", "test.webm");
      fd.append("file", superBuffer);
      fd.append("video_id", "customid");
      $.ajax({
          type: "POST",
          url: CONSTANTS.API_BASE_URL + "video/upload",
          data: fd,
          processData: false,
          contentType: false,
          success: function(msg){
            console.log(msg);
          },
          error: function(msg){
            console.log(msg);
            console.log(msg.responseJSON.message);
          }
        });
    }).prop('disabled', true);

    //Starts the recording of the video. Inspired in https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/record/js/main.js
    function startRecording() {

      if(recordedBlobs.length>0 && isComplete){
        //Video will be erased and you will have to record it again
        var r = confirm("Are you sure you want to record the whole fragment again?");
        if(r){
          isComplete = false;
          recordingElapsedTime = 0;
          $("#video_recording_progress").attr("aria-valuenow", 0).css('width', 0+'%')
          recordedBlobs = [];
        }else{
          return;
        }

      }
      // else if(recordedBlobs.length>0 && !isComplete){
      //   //Record from were it was left before
      // }else{
      //
      // }


      $("#fragment-complete").hide();

      loadStreaming();
      $("#video_recording_gif").show();
      $("#rec_button").prop('disabled', true);

      var options = {mimeType: 'video/webm;codecs=vp9'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: 'video/webm;codecs=vp8'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported');
          options = {mimeType: 'video/webm'};
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: ''};
          }
        }
      }
      try {
        mediaRecorder = new MediaRecorder(webcamstream, options);
      } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder: '
          + e + '. mimeType: ' + options.mimeType);
        return;
      }
      //console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(10); // collect 10ms of data
      console.log('MediaRecorder started', mediaRecorder);
      isRecording = true;
      //Will collect data for only the maximum amount of predefined seconds
      // 100 milliseconds allows our timer to stop properly
      recordingTimeOut = setTimeout(stopRecording, (CONSTANTS.VIDEO_FRAME_MAX_SECS*1000+100)-recordingElapsedTime);
      recordingTimer = setInterval(function(){
        //console.log(getTimeLeft(recordingTimeOut));
        recordingElapsedTime+=100;
        percentaje = (100*recordingElapsedTime)/(CONSTANTS.VIDEO_FRAME_MAX_SECS*1000);
        if(percentaje == 100){
          isComplete = true;
        }
        $("#video_recording_progress").attr("aria-valuenow", percentaje).css('width', percentaje+'%')
      }, 100);
    }

    //Stops the recording from the media recorder
    function stopRecording() {
      if (isRecording){
        //TODO: Show message when successfully completed for recorder
        //TODO: Change record to continue or something
        if(isComplete){
          //alert('Complete');
          var marginTop = video.offsetHeight / 2 - 10;
          $("#fragment-complete").css("margin-top", marginTop+"px");
          $("#fragment-complete").show();
        }
        video.pause();
        clearInterval(recordingTimer);
        clearTimeout(recordingTimeOut);
        $("#video_recording_gif").hide();
        console.log("Stopped recording");
        mediaRecorder.stop();
        isRecording = false;
        $("#rec_button").prop('disabled', false);
        $("#play_button").prop('disabled', false);
        console.log(recordedBlobs.length);
        console.log(recordingElapsedTime);
      }else{
        //TODO: is playing but not recording. Just stop it
      }

      // $("#submit_fragment_button").prop('disabled', true);
      //console.log('Recorded Blobs: ', recordedBlobs);
      //postVideoToServer(recordedBlobs);
    }

    //This function stores the blobs that will after converted into a video
    function handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }

    //Posts the video
    function postVideoToServer(videoblob) {
      console.log("Posting");
      var preview = document.querySelector("#video_preview");
      var superBuffer = new Blob(videoblob, {type: "video/webm"});
      preview.src = window.URL.createObjectURL(superBuffer);
    }

  } else {
    console.log("getUserMedia() is not supported by your browser");
    alert("We cannot record videos in your browser. Try another!");
  }

});
