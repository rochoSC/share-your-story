$(document).ready(function() {

  var usernameSession = localStorage.getItem("usernameSession");

  //Set the session for reference
  if(usernameSession){
    $("#usernameSession a").text(usernameSession);
  }
  
  $('#confirmLogOut').on('show.bs.modal', function(e) {
    $(this).find('.btn-ok').click(function(){
      localStorage.removeItem("usernameSession");
      window.location = "/";
    });
    // $('.debug-url').html('Delete URL: <strong>' + $(this).find('.btn-ok').attr('href') + '</strong>');
  });
});



var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};