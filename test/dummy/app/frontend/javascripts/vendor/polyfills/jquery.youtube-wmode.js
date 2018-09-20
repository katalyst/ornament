// Fixes youtube embed issues in IE8
$(document).ready(function() {
  $("iframe").each(function(){
    var ifr_source = $(this).attr('src');
    var wmode = "wmode=transparent";
    if(ifr_source.indexOf('?') != -1) {
      var getQString = ifr_source.split('?');
      var oldString = getQString[1];
      var newString = getQString[0];
      $(this).attr('src',newString+'?'+wmode+'&'+oldString);
    }
    else $(this).attr('src',ifr_source+'?'+wmode);
  });
});