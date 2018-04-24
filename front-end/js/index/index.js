function fillPage(msg) {
  jQuery.each(msg, function(index1, categories) {
    var $contenido = $("<div>").attr("id","subWrapper");
    var $idControl = "content".concat(index1)
    var $LinkIdControl = "#content".concat(index1)
    //console.log($idControl)
    var $category = $("<div>") //creating the slide for category
    var $categoryTitle = $("<div class='title text-left h1'>".concat(index1).concat("</div>"));
    $category.append($categoryTitle);
    var $myCarrusel = $("<div>").attr("id", $idControl).addClass("carousel slide");
    var $innercarousel = $("<div>").addClass("carousel-inner");
    var $classItem = "item active";
    var v = 0;
    for (v = 0; v < categories.length;) {
      console.log(index1);
      console.log(v)
      var $item = $("<div>").addClass($classItem);
      $classItem = "item";
      //hay un for aqui que es modulo 4
      var $row = $("<div>").addClass("row");
      //hay un for que va hasta el 4
      for (var i = 0; (i < 4 && v < categories.length); i++) {
        var $video = $("<div>").addClass("col-xs-3");
        console.log('otro AQUI!!!!!!!');
        console.log(index1);
        console.log(v)
        var $link = $("<a>").attr("href", "#?videoId=".concat(categories[v]["id"])).addClass("thumbnail").attr("data-target", "#VideoWatch").attr("data-toggle", "modal").data("src", categories[v]["url"]);

        $link.data("title", categories[v]["title"]).data("description", categories[v]["description"])
        $link.data("backgroundMusicUrl", categories[v]["backgroundMusicUrl"])
        $link.data("effect", categories[v]["effect"])
        var $thumbnail = $("<img>").attr("src", categories[v]["thumbnailUrl"]).attr("style", "height:50%; width:100%"); //add thumbnailroute
        console.log(categories[v]["thumbnailUrl"])
        $link.append($thumbnail);
        $video.append($link);
        $video.append("<p.title>"+categories[v]["title"]+"</p>")
        $row.append($video);
        v++;
        console.log('despues de incrementar');
        console.log(v)
      } //termina el for que va hasta el 4

      //termina el for
      $innercarousel.append($item);
      $item.append($row)
    }
    var $leftControl = $("<a>").addClass("left carousel-control").attr("href", $LinkIdControl).attr("data-slide", "prev").text("‹")
    var $rightControl = $("<a>").addClass("right carousel-control").attr("href", $LinkIdControl).attr("data-slide", "next").text("›")

    $myCarrusel.append($innercarousel);
    $myCarrusel.append($leftControl);
    $myCarrusel.append($rightControl);
    $category.append($myCarrusel);
    $contenido.append($category);
    $("#wrapper").append($contenido);


  }); //every category first for
}

function onLoadVideo(audio, effectType){

  $('#VideoWatch').on('hidden.bs.modal', function () {
    console.log("Closing the modal");
    stopVideo();
    setStyle(false);
  });

  $('#VideoWatch').on('shown.bs.modal', function () {
    console.log("Closing the modal");
    playVideo();
  });

  function setStyle(val){
    if(val){
      for (var i = 0; i < CONSTANTS.AVAILABLE_EFFECTS.length; i++) {
        if(CONSTANTS.AVAILABLE_EFFECTS[i].name == effectType){
          document.querySelector("#final-video").style = CONSTANTS.AVAILABLE_EFFECTS[i].value;
          document.querySelector("#final-video").style.webkitFilter = CONSTANTS.AVAILABLE_EFFECTS[i].value;
          document.querySelector("#final-video").style.mozFilter = CONSTANTS.AVAILABLE_EFFECTS[i].value;
          document.querySelector("#final-video").style.filter = CONSTANTS.AVAILABLE_EFFECTS[i].value;

          document.querySelector("#final-video").style.width = "100%";
        }
      }
    }else{
        document.querySelector("#final-video").style = undefined;
        document.querySelector("#final-video").style.webkitFilter = undefined;
        document.querySelector("#final-video").style.mozFilter = undefined;
        document.querySelector("#final-video").style.filter = undefined;
        document.querySelector("#final-video").style.width = "100%";
    }
  }

  if(effectType){
    setStyle(true);
  }

  // Video controls
  var videoDuration;
  var fadeAudio;

  function stopAudio(){
    console.log("Stop music");
    audio.pause()
    audio.currentTime = 0;
    if(fadeAudio){
      clearInterval(fadeAudio);
    }
  }

  function playAudio(){
    console.log("Play music");
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.2;
    audio.play();
    var fadePoint = videoDuration-4;
    fadeAudio = setInterval(function () {
      var step = 0.02;
      if ((audio.currentTime >= fadePoint) && ((audio.volume - step) >= 0.0)) {
        audio.volume -= step;
      }
      // When volume at zero stop all the intervalling
      if ((audio.volume - step) <= 0.0) {
        stopAudio();
      }
    }, 200);
  }

  function stopVideo(){
    document.querySelector('#final-video').pause();
    document.querySelector('#final-video').currentTime = 0;
    if(audio){
      stopAudio();
    }
  }

  function playVideo(){
    videoDuration = document.querySelector('#final-video').duration;
    console.log(videoDuration);
    document.querySelector('#final-video').play();
    if(audio){
      playAudio();
    }
  }


}

$(document).ready(function() {

  var usernameSession = localStorage.getItem("usernameSession");

  if (usernameSession) {
    $("#logOutDropDown").show();
    $("#goToDashboard").show();
    $("#shareStory").hide();
  }
  else {
    $("#logOutDropDown").hide();
    $("#goToDashboard").hide();
    $("#shareStory").show();
  }

  //This file must be added on every js that uses ajax calls to our API server
  $.getScript("js/constants.js", function() {
    console.log("Constants file loaded")
    //Load the list videos
   $.ajax({
      type: "GET",
      //contentType: "application/json",
      url: CONSTANTS.API_BASE_URL + "videos",
      //dataType: 'json',
      success: function(msg) {
        fillPage(msg)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("Error")
        printError(jqXHR, textStatus, errorThrown)

      }
    });

  });

  $("#searchButton").click(function() {
    console.log("On Click");
    console.log($("#searchText").val());
    document.getElementById("paginaIndex").removeChild(document.getElementById("wrapper"))
    wrapper = $("<div>").attr("id","wrapper");
    $("#paginaIndex").append(wrapper)
    $("#subWrapper").remove();
    $.ajax({
      type: "GET",
      //contentType: "application/json",
      url: CONSTANTS.API_BASE_URL + "video/search?keys="+$("#searchText").val(),
      data: JSON.stringify({
        keys: $("#searchText").val()
      }),
      //dataType: 'json',
      success: function(msg) {
        console.log(msg)
        fillPage(msg)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        printError(jqXHR, textStatus, errorThrown)
      }
    });


  });


  //Submit loggin info
  $("#loginForm").submit(function() {

    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: CONSTANTS.API_BASE_URL + "user/login",
      data: JSON.stringify({
        username: $("#loginForm #usernameL").val(),
        password: $("#loginForm #passwordL").val()
      }),
      dataType: 'json',
      success: function(msg) {
        $("#loginForm #loginErrorMsg").hide();
        //Storing on localStorage for future session references
        localStorage.setItem("usernameSession", $("#loginForm #usernameL").val().toLowerCase());
        window.location = "dashboard"
      },
      error: function(msg) {
        $("#loginForm #loginErrorMsg").text(msg.responseJSON.message);
        $("#loginForm #loginErrorMsg").fadeIn();
      }
    });
    return false;
  });

  $("#registerForm").submit(function() {

    if ($("#passwordR").val().length < 6) {
      $("#registerForm #registerErrorMsg").text("Password too short");
      $("#registerForm #registerErrorMsg").fadeIn();
      return false;
    }
    if ($("#passwordR").val() !== $("#confirmPasswordR").val()) {
      $("#registerForm #registerErrorMsg").text("Passwords does not match");
      $("#registerForm #registerErrorMsg").fadeIn();
      return false;
    }
    $("#registerForm #registerErrorMsg").hide();

    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: CONSTANTS.API_BASE_URL + "user/register",
      data: JSON.stringify({
        username: $("#registerForm #usernameR").val().toLowerCase(),
        password: $("#registerForm #passwordR").val(),
        name: $("#registerForm #nameR").val(),
        lastname: $("#registerForm #lastnameR").val()
      }),
      dataType: 'json',
      success: function(msg) {
        $("#registerForm #registerErrorMsg").hide();
        //Storing on localStorage for future session references
        localStorage.setItem("usernameSession", $("#registerForm #usernameR").val().toLowerCase());
        window.location = "dashboard"
      },
      error: function(msg) {
        $("#registerForm #registerErrorMsg").text(msg.responseJSON.message);
        $("#registerForm #registerErrorMsg").fadeIn();
      }
    });
    return false;
  });

  //Showing register view when clicked on create account
  $("#createAccount").click(function() {
    $("#loginView").hide();
    $("#registerView").show();
  });

  //Showing login view when clicked on back to login button
  $("#backToLogin").click(function() {
    $("#registerView").hide();
    $("#loginView").show();
  });

  $(document).on("click", ".thumbnail", function () {
    //TODO: Add stop video when dismiss
     var myVideoURL = $(this).data('src');
     if (!myVideoURL.includes("embed")){
       pos =myVideoURL.lastIndexOf("/");
     }
     $(".modal-body #final-video").attr( "src", myVideoURL);
     $("#videoTitle").text($(this).data('title'));
     $("#titleDescription").text($(this).data('description'));

     var effectType;
     var audio;
     console.log($(this));
     console.log("Music?");
     console.log($(this).data('backgroundMusicUrl'));
     if($(this).data('backgroundMusicUrl')){
       audio = new Audio("../"+$(this).data('backgroundMusicUrl'));
     }

     if($(this).data('effect')){
       effectType = $(this).data('effect');
     }
     onLoadVideo(audio, effectType);
     // As pointed out in comments,
     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
   });





});
