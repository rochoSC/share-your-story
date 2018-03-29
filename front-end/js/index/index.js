
$(document).ready(function() {
  
  


  var usernameSession = localStorage.getItem("usernameSession");

  if (usernameSession) {
    $("#usernameSession").show();
    $("#goToDashboard").show();
    $("#shareStory").hide();
  }
  else {
    $("#usernameSession").hide();
    $("#goToDashboard").hide();
    $("#shareStory").show();
  }

  //This file must be added on every js that uses ajax calls to our API server
  $.getScript("js/constants.js", function() {console.log("Constants file loaded")
    //Load the list videos
   $.ajax({
      type: "GET",
      contentType: "application/json",
      url: CONSTANTS.API_BASE_URL + "videos",
      data: JSON.stringify({}),
      dataType: 'json',
      success: function(msg) {
        //fill the categories
        jQuery.each(msg, function(index1, categories) {
          
          var $idControl = "#content".concat(index1)
          //console.log($idControl)
          var $category = $("<div>") //creating the slide for category
          var $categoryTitle = $("<div class='title text-left h1'>".concat(index1).concat("</div>"));
          $category.append($categoryTitle);
          var $myCarrusel = $("<div>").attr("id",$idControl).addClass("carousel slide");
          var $innercarousel = $("<div>").addClass("carousel-inner");
          var $classItem = "item active";
          for( v=0;v<categories.length;){
            var $item = $("<div>").addClass($classItem);
            var $classItem = "item";
            //hay un for aqui que es modulo 4
            var $row =$("<div>").addClass("row");
            //hay un for que va hasta el 4
            for(i=0; i<4&&i<categories.length ;i++ ){
              var $video = $("<div>").addClass("col-xs-3");
              var $link = $("<a>").attr("href","#?id=".concat(categories[v]["id"])).addClass("thumbnail").attr("data-target","#VideoWatch").attr("data-toggle","modal").data("src",categories[v]["url"]);
              $link.data("title",categories[v]["title"]).data("description",categories[v]["description"])
              var $thumbnail = $("<img>").attr("src",categories[v]["thumbnail"]); //add thumbnailroute
              $link.append($thumbnail);
              $video.append($link);
              $row.append($video);
              v++;
            }//termina el for que va hasta el 4
            //termina el for 
            $item.append($row)
          }
          var $leftControl = $("<a>").addClass("left carousel-control").attr("href",$idControl).attr("data-slide","prev").text("‹")
          var $rightControl = $("<a>").addClass("right carousel-control").attr("href",$idControl).attr("data-slide","next").text("›")
          $innercarousel.append($item);
          $myCarrusel.append($innercarousel);
          $myCarrusel.append($leftControl);
          $myCarrusel.append($rightControl);
          $category.append($myCarrusel);
          console.log($category[0])
          $("#wrapper").append($category);
          
          
        }); //every category first for
        
      },
      error: function(msg) {
        //something happened
        //maybe show an alert of something like that.
        alert("Something happened");
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
     var myVideoURL = $(this).data('src');
     if (!myVideoURL.includes("embed")){
       pos =myVideoURL.lastIndexOf("/")
       myVideoURL = "http://www.youtube.com/embed/".concat(myVideoURL.substr(pos+1,myVideoURL.length))
     }
     $(".modal-body #videoToWatch").attr( "src", myVideoURL);
     $("#videoTitle").text($(this).data('title'))
     $("#titleDescription").text($(this).data('description'))
     
     // As pointed out in comments, 
     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
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
