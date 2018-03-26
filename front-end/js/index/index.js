

function rightControl(content){
  //  $(control).mouseover(function() {
      event.preventDefault();
      //if(parseInt($(content).css('marginRight'))<0){
        $(content).animate({
          marginLeft: "-=400px"
        }, "fast");
      //}
   //});
}

function leftControl(content){
 //$('#controlL').mouseover(function() {
      event.preventDefault();
      if(parseInt($(content).css('marginLeft'))<0){
       $(content).animate({
          marginLeft: "+=400px"
        }, "fast");
    }
 //});

}

$(document).ready(function() {
  
  
    

  var usernameSession = localStorage.getItem("usernameSession");

  if(usernameSession){
    $("#usernameSession").show();
    $("#goToDashboard").show();
    $("#shareStory").hide();
  }else{
    $("#usernameSession").hide();
    $("#goToDashboard").hide();
    $("#shareStory").show();
  }
  
  //This file must be added on every js that uses ajax calls to our API server
  $.getScript("js/constants.js", function() {
     console.log("Constants file loaded")
     //Load the list videos
    var videos = $.ajax({type: "GET",
      contentType: "application/json",
      url: CONSTANTS.API_BASE_URL + "videos",
      data: JSON.stringify({}),
      dataType: 'json',
      success: function(msg){
        //fill the categories
        console.log(msg);
        
        
        jQuery.each(msg, function(index1,categories){
          var $carrusel = $("<div>");
          var $newCat = $("<div class='title text-left h1'>".concat(index1).concat("</div>") )
          var $idControl = "'#content".concat(index1).concat("'");
          var $controles=$("<div id='controlL' class='left-controls' role='button' aria-label='See Previous Modules' onmouseover='leftControl(".concat($idControl).concat(")' ><b class='fa fa-chevron-left fa-chevron-left-extra' aria-hidden='true' ></b></div>"));
          var $listaVideos = $("<ul id=".concat($idControl).concat(">"));
          $carrusel.append($newCat)
          $carrusel.append($controles)
          // $("#ul").append($("<li>").text("Some Text."));
          jQuery.each(categories,function(index2,video){
           var $thumbnail = $("<img>").attr("src",video["thumbnail"]).attr("height","150px").attr("width","150px");
           var $title = $("<p>").addClass("text-light bg-dark").text(video["title"]);
           var $inside = $("<div>").addClass("inside-top");
            $inside.append($thumbnail)
            $inside.append($title)
            var $item = $("<li>").addClass("card effect1");
            $item.append($thumbnail)
            $item.append($title)
            $listaVideos .append($item)
            $carrusel.append($listaVideos)
          });
          var $arrowR = $("<b class='fa fa-chevron-right fa-chevron-right-extra' aria-hidden='true' ></b>");
          var $controlR = $("<div>").attr("id","controlR").addClass("right-controls").attr("role","button").attr("aria-label","See Previous Modules").attr("onmouseover","rightControl(".concat($idControl).concat(")"));
          $controlR.append($arrowR);
          $carrusel.append($controlR)
          $("#wrapper").append($carrusel);
        });
        
        
        // 
        
    
    
        // 
        // $("#wrapper").append($controles)
          
          
        
      },
      error: function(msg){
        //something happened
        //maybe show an alert of something like that.
        alert("Something happened")
        
      }
      
      });
  });

  //Submit loggin info
  $("#loginForm").submit(function(){

    $.ajax({
    type: "POST",
    contentType: "application/json",
    url: CONSTANTS.API_BASE_URL + "user/login" ,
    data: JSON.stringify({
      username: $("#loginForm #usernameL").val(),
      password: $("#loginForm #passwordL").val()
    }),
    dataType: 'json',
    success: function(msg){
      $("#loginForm #loginErrorMsg").hide();
      //Storing on localStorage for future session references
      localStorage.setItem("usernameSession",$("#loginForm #usernameL").val().toLowerCase());
      window.location = "dashboard"
    },
    error: function(msg){
      $("#loginForm #loginErrorMsg").text(msg.responseJSON.message);
      $("#loginForm #loginErrorMsg").fadeIn();
    }
    });
    return false;
  });

  $("#registerForm").submit(function(){

    if ($("#passwordR").val().length < 6){
      $("#registerForm #registerErrorMsg").text("Password too short");
      $("#registerForm #registerErrorMsg").fadeIn();
      return false;
    }
    if ($("#passwordR").val() !== $("#confirmPasswordR").val()){
      $("#registerForm #registerErrorMsg").text("Passwords does not match");
      $("#registerForm #registerErrorMsg").fadeIn();
      return false;
    }
    $("#registerForm #registerErrorMsg").hide();

    $.ajax({
    type: "POST",
    contentType: "application/json",
    url: CONSTANTS.API_BASE_URL + "user/register" ,
    data: JSON.stringify({
      username: $("#registerForm #usernameR").val().toLowerCase(),
      password: $("#registerForm #passwordR").val(),
      name: $("#registerForm #nameR").val(),
      lastname: $("#registerForm #lastnameR").val()
    }),
    dataType: 'json',
    success: function(msg){
      $("#registerForm #registerErrorMsg").hide();
      //Storing on localStorage for future session references
      localStorage.setItem("usernameSession",$("#registerForm #usernameR").val().toLowerCase());
      window.location = "dashboard"
    },
    error: function(msg){
      $("#registerForm #registerErrorMsg").text(msg.responseJSON.message);
      $("#registerForm #registerErrorMsg").fadeIn();
    }
    });
    return false;
  });

  //Showing register view when clicked on create account
  $("#createAccount").click(function(){
    $("#loginView").hide();
    $("#registerView").show();
  });

  //Showing login view when clicked on back to login button
  $("#backToLogin").click(function(){
    $("#registerView").hide();
    $("#loginView").show();
  });
});
/*jQuery(document).ready(function ($) {



	var slideCount = $('.module-section ul li').length;
	var slideWidth = $('.module-section ul li').width();
	var slideHeight = $('.module-section ul li').height();
	var sliderUlWidth = slideCount * slideWidth;

	$('.module-section').css({ width: slideWidth, height: slideHeight });

	$('.module-section ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

    $('.module-section ul li:last-child').prependTo('.module-section ul');

    function moveLeft() {
        $('.module-section ul').animate({
            left: + slideWidth
        }, 200, function () {
            $('.module-section ul li:last-child').prependTo('.module-section ul');
            $('.module-section ul').css('left', '');
        });
    };

    function moveRight() {
        $('.module-section ul').animate({
            left: - slideWidth
        }, 200, function () {
            $('.module-section ul li:first-child').appendTo('.module-section ul');
            $('.module-section ul').css('left', '');
        });
    };

    $('.left-controls').click(function () {
        moveLeft();
    });

    $('.right-controls').click(function () {
        moveRight();
    });

});



*/


/*$(document).ready(function() {

    $("#my_projects_nav").click(function() {

      //Menu UI
      $("#my_uploads_nav").removeClass("active");
      $("#my_projects_nav").addClass("active");

      //Menu content display
      $("#my_projects_container").removeClass("d-none");
      $("#my_uploads_container").addClass("d-none");
    });

    $("#my_uploads_nav").click(function() {
      $("#my_projects_nav").removeClass("active");
      $("#my_uploads_nav").addClass("active");

      $("#my_uploads_container").removeClass("d-none");
      $("#my_projects_container").addClass("d-none");
    });

    $("#add_video").click(function() {
        var href = $(this).find("a").attr("href");
        if(href) {
            window.location = href;
        }
    });

    $("#add_video").hover(function() {
        $(this).css("cursor","pointer");
    });

});*/
