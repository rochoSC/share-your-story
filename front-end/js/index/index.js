function fillPage(msg) {  
  jQuery.each(msg, function(index1, categories) {
    var $contenido = $("<div>").attr("id","subWrapper");
    var $idControl = "#content".concat(index1)
    //console.log($idControl)
    var $category = $("<div>") //creating the slide for category
    var $categoryTitle = $("<div class='title text-left h1'>".concat(index1).concat("</div>"));
    $category.append($categoryTitle);
    var $myCarrusel = $("<div>").attr("id", $idControl).addClass("carousel slide");
    var $innercarousel = $("<div>").addClass("carousel-inner");
    var $classItem = "item active";
    for (v = 0; v < categories.length;) {
      var $item = $("<div>").addClass($classItem);
      var $classItem = "item";
      //hay un for aqui que es modulo 4
      var $row = $("<div>").addClass("row");
      //hay un for que va hasta el 4
      for (i = 0; i < 4 && i < categories.length; i++) {
        var $video = $("<div>").addClass("col-xs-3");
        var $link = $("<a>").attr("href", "#?videoId=".concat(categories[v]["id"])).addClass("thumbnail").attr("data-target", "#VideoWatch").attr("data-toggle", "modal").data("src", categories[v]["url"]);
        $link.data("title", categories[v]["title"]).data("description", categories[v]["description"])
        var $thumbnail = $("<img>").attr("src", categories[v]["thumbnailUrl"]); //add thumbnailroute
        console.log(categories[v]["thumbnailUrl"])
        $link.append($thumbnail);
        $video.append($link);
        $row.append($video);
        v++;
      } //termina el for que va hasta el 4
      //termina el for
      $item.append($row)
    }
    var $leftControl = $("<a>").addClass("left carousel-control").attr("href", $idControl).attr("data-slide", "prev").text("‹")
    var $rightControl = $("<a>").addClass("right carousel-control").attr("href", $idControl).attr("data-slide", "next").text("›")
    $innercarousel.append($item);
    $myCarrusel.append($innercarousel);
    $myCarrusel.append($leftControl);
    $myCarrusel.append($rightControl);
    $category.append($myCarrusel);
    $contenido.append($category);
    $("#wrapper").append($contenido);


  }); //every category first for
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
    $("#subWrapper").remove();
    //$("#subWrapper").remove();
    $.ajax({
      type: "GET",
      //contentType: "application/json",
      url: CONSTANTS.API_BASE_URL + "video/search?keys="+$("#searchText").val(),
      data: JSON.stringify({
        keys: $("#searchText").val()
      }),
      //dataType: 'json',
      success: function(msg) {

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
     var myVideoURL = $(this).data('src');
     if (!myVideoURL.includes("embed")){
       pos =myVideoURL.lastIndexOf("/")
       myVideoURL = myVideoURL
     }
     $(".modal-body #final-video").attr( "src", myVideoURL);
     $("#videoTitle").text($(this).data('title'))
     $("#titleDescription").text($(this).data('description'))

     // As pointed out in comments,
     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
});

});
