$(document).ready(function() {

		var usernameSession = localStorage.getItem("usernameSession");
		if(!usernameSession){
			//Redirect to index since there is no session to work with
			window.location = "/";
		} else {
			//Set the session for reference
			$("#usernameSession").text(usernameSession);
		}

		$('#confirmLogOut').on('show.bs.modal', function(e) {
			$(this).find('.btn-ok').click(function(){
				localStorage.removeItem("usernameSession");
				window.location = "/";
			});
			// $('.debug-url').html('Delete URL: <strong>' + $(this).find('.btn-ok').attr('href') + '</strong>');
    });

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



});
