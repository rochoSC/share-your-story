$(document).ready(function() {
  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
  };


  var video = document.querySelector('#final-video');//For some reason does not work with jquery selectors
  var thumbnailFile;
  var musicPath;
  var effectType;


  //This file must be added on every js that uses ajax calls to our API server
  $.getScript("../js/constants.js", function() {
    console.log("Constants file loaded")
    $.ajax({
      type: "GET",
      url: CONSTANTS.API_BASE_URL + "video/"+getUrlParameter("videoId"),
    success: function(msg){
      console.log(msg);
      video.src = "../"+msg.url;
      video.pause();
    },
    error: function(msg){
      console.log(msg);
      console.log(msg.responseJSON.message);
    }
    });

    $.ajax({
      type: "GET",
      url: CONSTANTS.API_BASE_URL + "video/music",
      success: function(msg){
        for (var i = 0; i < msg.length; i++) {
          var path = msg[i];
          var name = path.split("/");
          name = name[name.length - 1];
          name = name.split("_").join(" ");

          $li = $("<li>").addClass("list-group-item btn").text(name);
          $li.click((function(path, name) {
           return function() {
                $("#music").modal("hide");
                $("#music-name").text(name);
                musicPath = path;
           };
          })(path, name));
          $("#list-of-music").append($li);
        }
      },
      error: function(msg){
        console.log(msg);
        console.log(msg.responseJSON.message);
      }
    });

    for (var i = 0; i < CONSTANTS.AVAILABLE_EFFECTS.length; i++) {
      $li = $("<li>").addClass("list-group-item btn").text(CONSTANTS.AVAILABLE_EFFECTS[i].name);
      $li.click((function(effect) {
       return function() {
        $("#effects").modal("hide");
        $("#effect-name").text(effect.name);
        effectType = effect;
        document.querySelector("video").style = effect.value;
        document.querySelector("video").style.webkitFilter = effect.value;
        document.querySelector("video").style.mozFilter = effect.value;
        document.querySelector("video").style.filter = effect.value;
        //TODO: Save music, effect and thumbnail on submit
       };
     })(CONSTANTS.AVAILABLE_EFFECTS[i]));
      $("#list-of-effects").append($li);
    }

    $("#btn-play").click(function(){
      video.pause();
      video.currentTime = 0;
      video.load();
    });

    $("#btn-stop").click(function(){
      video.pause();
      video.currentTime = 0;
    });



    $("#btn-thumbnail").change(function(){
      console.log("Click thumbnail");
      thumbnailFile = document.getElementById("btn-thumbnail");
      var name = thumbnailFile.value.split("\\");
      $("#thumbnail-name").text(name[name.length-1]);

    });

  });

});
