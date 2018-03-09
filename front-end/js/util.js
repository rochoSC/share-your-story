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
