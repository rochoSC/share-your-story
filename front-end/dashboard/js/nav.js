$(document).ready(function() {

		var usernameSession = localStorage.getItem("usernameSession");
		if(!usernameSession){
			//Redirect to index since there is no session to work with
			window.location = "/";
		}

		$.getScript("../js/constants.js", function() {
	     console.log("Constants file loaded")
			 $.ajax({
	         type: "GET",
	         url: CONSTANTS.API_BASE_URL + "videos/user/"+usernameSession,
	         success: function(msg){
	           console.log(msg);
						 projects = msg.incomplete;
						 uploads = msg.published;
						 for (var i = 0; i < projects.length; i++) {
							 $div = $("<div>").addClass("col-6 col-sm-3 placeholder");
							 $img = $("<img>").attr("src", "../"+projects[i].thumbnailUrl).attr("width", "200px").attr("height", "200px").addClass("img-fluid rounded-circle btn");
							 $img.css("width", "200px").css("height", "200px");

							 $img.click((function(project) {
                return function() {
                     window.location = "/edit?id=" + project._id.$oid;
                };
		           })(projects[i]));

							 $div.append($img);
							 $div.append($("<h4>").text(projects[i].title));
							 $div.append($("<span>").addClass("text-muted").text(projects[i].description));
							 $("#my_projects_container").append($div);
							 $div.hide();
							 $div.show("slow")
						 }

						 for (var i = 0; i < uploads.length; i++) {
							 $div = $("<div>").addClass("col-6 col-sm-3 placeholder");
							 $img = $("<img>").attr("src", "../"+uploads[i].thumbnailUrl).attr("width", "200px").attr("height", "200px").addClass("img-fluid rounded-circle");
							 $img.css("width", "200px").css("height", "220px");

							 $div.append($img);
							 $div.append($("<h4>").text(uploads[i].title));
							 $div.append($("<span>").addClass("text-muted").text(uploads[i].description));
							 $("#my_uploads_container").append($div);
							 $("#my_uploads_container").hide();
						 }

	         },
	         error: function(msg){
	           console.log(msg);
	           console.log(msg.responseJSON.message);
	         }
	       });
		 });

		$("#my_projects_nav").click(function() {

			//Menu UI
			$("#my_uploads_nav").removeClass("active");
			$("#my_projects_nav").addClass("active");

			//Menu content display
			$("#my_projects_container").removeClass("d-none");
			$("#my_uploads_container").addClass("d-none");

			$("#my_uploads_container").hide();
			$("#my_projects_container").show("fast");
    });

		$("#my_uploads_nav").click(function() {
			$("#my_projects_nav").removeClass("active");
			$("#my_uploads_nav").addClass("active");

			$("#my_uploads_container").removeClass("d-none");
			$("#my_projects_container").addClass("d-none");

			$("#my_projects_container").hide();
			$("#my_uploads_container").show("fast");
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



});
