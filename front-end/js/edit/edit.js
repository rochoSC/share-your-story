function fillPage(msg) {

  jQuery.each(msg, function(index1, categories) {
    var $contenido = $("<div>").attr("id", "subWrapper");
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
        var $link = $("<a>").attr("href", "#?id=".concat(categories[v]["id"])).addClass("thumbnail").attr("data-target", "#VideoWatch").attr("data-toggle", "modal").data("src", categories[v]["url"]);
        $link.data("title", categories[v]["title"]).data("description", categories[v]["description"])
        var $thumbnail = $("<img>").attr("src", categories[v]["thumbnail"]); //add thumbnailroute
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
  $.getScript("/js/constants.js", function() {
    console.log("Constants file loaded")
    //Load categories
    $.ajax({
      type: "GET",
      url: CONSTANTS.API_BASE_URL + "category",
      data: JSON.stringify({}),
      success: function(msg) {
        
        jQuery.each(msg, function(index, categories) {
          console.log(categories._id)
          $("#categories").append("<option value=" + categories._id["$oid"] + ">" + categories.name + "</option>")
        }); //foreach
      }, //sucess
      error: function(jqXHR, textStatus, errorThrown) {
        printError(jqXHR, textStatus, errorThrown)
      }
    }); //ajax

    $.getScript("../js/edit/tags.js", function() {
     var projectId = getUrlParameter("id")
     if(projectId){
       console.log(projectId)
      $.ajax({
          type: "GET",
          //contentType: "application/json",
          url: CONSTANTS.API_BASE_URL + "project/"+projectId.replace(/\"/g,""),
          data: JSON.stringify({}),
          //dataType: 'json',
          success: function(msg) {
            console.log(msg[0]["title"])
            $("#title").val(msg[0]["title"])
            $("#description").val(msg[0]["description"])
            $("#tags-input").val(msg[0]["tags"])
            console.log(msg[0]["fragments"])
            
          },
          error: function(jqXHR, textStatus, errorThrown) {
            printError(jqXHR, textStatus, errorThrown)
          }
        });
    } //IF 
    });//loading files
  });
});


//Create Project
$("#projectForm").submit(function() {
  console.log($("#tags-input").val())
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: CONSTANTS.API_BASE_URL + "video/create",
    data: JSON.stringify({
      owner: localStorage.getItem("owner"),
      id: $("#projectId").val(),
      title: $("#title").val(),
      category: $("#categories").val(),
      description: $("#description").val(),
      tags: $("#tags-input").val()
    }),
    dataType: 'json',
    success: function(msg) {
      localStorage.setItem("projectId", msg["projectId"]);
      document.getElementById("projectId").value = msg["projectId"]
      document.getElementById("createButton").innerHTML = "Save"
    },
    error: function(msg) {
      // Figure out what to do in error case
    }
  });
  return false;
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

  







