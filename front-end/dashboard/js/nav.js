$(document).ready(function() {

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
