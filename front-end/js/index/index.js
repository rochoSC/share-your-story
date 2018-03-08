

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
