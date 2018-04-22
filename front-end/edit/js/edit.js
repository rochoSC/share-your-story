function fillCategory(selectedLocal){
   $.ajax({
              type: "GET",
              url: CONSTANTS.API_BASE_URL + "category",
              data: JSON.stringify({}),
              success: function(msg) {
                console.log(msg)
                jQuery.each(msg, function(index, categories) {
                console.log(categories)
                console.log(selectedLocal[categories._id["$oid"]])
                  $("#categories").append("<option value=" + categories._id["$oid"] + " " + selectedLocal[categories._id["$oid"]] + ">" + categories.name + "</option>")
                }); //foreach
              }, //sucess
              error: function(jqXHR, textStatus, errorThrown) {
                printError(jqXHR, textStatus, errorThrown)
              }
            }); //ajax
}



$(document).ready(function() {
  var usernameSession = localStorage.getItem("usernameSession");
  if (usernameSession) {
    $("#usernameSession").show();
    $("#goToDashboard").show();
    $("#shareStory").hide();
  } else {
    $("#usernameSession").hide();
    $("#goToDashboard").hide();
    $("#shareStory").show();
  }

  //This file must be added on every js that uses ajax calls to our API server
  var selected = {};
  $.getScript("/js/constants.js", function() {
    console.log("Constants file loaded")
      var projectId = getUrlParameter("id")
      if (projectId) {
        console.log(projectId)
        $.ajax({
          type: "GET",
          //contentType: "application/json",
          url: CONSTANTS.API_BASE_URL + "project/" + projectId.replace(/\"/g, ""),
          data: JSON.stringify({}),
          //dataType: 'json',
          success: function(msg) {
            owner: localStorage.getItem("usernameSession");
            $("#title").val(msg[0]["title"]);
            $("#description").val(msg[0]["description"]);
            $("#projectId").val(msg[0]["_id"]["$oid"]);
            selected[msg[0]["category"]] = "selected";
            //document.getElementById(msg[0]["category"]).setAttribute("selected","selected")
            var count = 0;
            msg[0]["fragments"].forEach(function(frag) {
              document.getElementById("thumbnail" + frag["fragmentId"]).setAttribute("src", "../" + frag["thumbnailUrl"])
              count += 1
            });
            if (count == CONSTANTS.NUMBER_OF_FRAGMENTS) {
              document.getElementById("publishToModal").setAttribute("disabled",false)
              document.getElementById("publishButton").setAttribute("href", "../publish?videoId=" + msg[0]["_id"]["$oid"])
            }
            localStorage.removeItem("tags")
            localStorage.setItem("tags",msg[0]["tags"])
            document.getElementById("fragmento1").setAttribute("href", "../record?videoId=" + msg[0]["_id"]["$oid"] + "&fragmentId=1");
            document.getElementById("fragmento2").setAttribute("href", "../record?videoId=" + msg[0]["_id"]["$oid"] + "&fragmentId=2");
            document.getElementById("fragmento3").setAttribute("href", "../record?videoId=" + msg[0]["_id"]["$oid"] + "&fragmentId=3");
            document.getElementById("fragmento4").setAttribute("href", "../record?videoId=" + msg[0]["_id"]["$oid"] + "&fragmentId=4");
            document.getElementById("fragmento5").setAttribute("href", "../record?videoId=" + msg[0]["_id"]["$oid"] + "&fragmentId=5");
            document.getElementById("createButton").innerHTML = "Save"
            console.log(selected)
            fillCategory(selected)
          },
          error: function(jqXHR, textStatus, errorThrown) {
            printError(jqXHR, textStatus, errorThrown)
          }
        });
      }else{
        localStorage.removeItem("tags")
        console.log(selected)
        fillCategory(selected)
      } //IF

  });
});


//Create Project
$("#createButton").click(function() {
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: CONSTANTS.API_BASE_URL + "video/create",
    data: JSON.stringify({
      owner: localStorage.getItem("usernameSession"),
      id: $("#projectId").val(),
      title: $("#title").val(),
      category: $("#categories").val(),
      description: $("#description").val(),
      tags: $("#tags-input").val(),
      thumbnailUrl: "/uploads/default.jpg",
      published: false,
      fragments: []
    }),
    dataType: 'json',
    success: function(msg) {
      localStorage.setItem("projectId", msg["projectId"]);
      document.getElementById("projectId").value = msg["projectId"]
      document.getElementById("fragmento1").setAttribute("href", "../record?videoId=" + msg["projectId"] + "&fragmentId=1");
      document.getElementById("fragmento2").setAttribute("href", "../record?videoId=" + msg["projectId"] + "&fragmentId=2");
      document.getElementById("fragmento3").setAttribute("href", "../record?videoId=" + msg["projectId"] + "&fragmentId=3");
      document.getElementById("fragmento4").setAttribute("href", "../record?videoId=" + msg["projectId"] + "&fragmentId=4");
      document.getElementById("fragmento5").setAttribute("href", "../record?videoId=" + msg["projectId"] + "&fragmentId=5");
      document.getElementById("createButton").innerHTML = "Save"
    },
    error: function(msg) {
      // Figure out what to do in error case
    }
  });
  return false;
});



$("#deleteButton").click(function() {
  if ($("#projectId").val()) {
    if (confirm("You are about to delete " + $("#title").val())) {
      $.ajax({
        type: "POST",
        contentType: "application/json",
        url: CONSTANTS.API_BASE_URL + "project/delete",
        data: JSON.stringify({
          id: $("#projectId").val()
        }),
        dataType: 'json',
        success: function(msg) {
          //redirect
          console.log("It was deleted")
          window.location = "../dashboard"
        },
        error: function(jqXHR, textStatus, errorThrown) {
          printError(jqXHR, textStatus, errorThrown)
        }
      }); //ajax
    } //confirm
  } //if
}); //onclick






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
