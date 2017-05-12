/**
 * Created by user on 2016/2/18.
 */
// jQuery( document ).ready(function( $ ) {

//     var src = "https://api.twitter.com/1.1/search/tweets.json?q=%23city&result_type=recent";
//     $.get(src,
//     {},function(jsonData) {
//         var json = $.parseJSON(jsonData);
//         $(json).each(function(i, val){
//         	var a = i;
//         	var b = val;
//         });
//     });
// });

$(document).ready(function() {
  $("#demo-pics-controls").on('click', 'span', function() {
    stopAudio();
    $("#demo-pics img").removeClass("opaque");

    var newImage = $(this).index();
    console.log(newImage);  
    $("#demo-pics img").eq(newImage).addClass("opaque");

    $("#demo-pics-controls").find("span").removeClass("selected");
    $(this).find("span").addClass("selected");
    setAudioPlay(true,newImage);
  });
  //when the pic is clicked, show next pic.
  $("#demo-pics img").on('click', function(){
    stopAudio();
  	var image = $(".opaque");
    console.log(image[0].alt);
   
    var newImageIndex = parseInt(image[0].alt);
    console.log(newImageIndex);
    
    if(newImageIndex > 2){
    	newImageIndex = 0;
    }
    setAudioPlay(true, newImageIndex+1);
    $("#demo-pics").find("img").removeClass("opaque");
    $("#demo-pics").find("img").eq(newImageIndex).addClass("opaque");
   
    // $("#demo-pics-controls").find("span").removeClass("selected");
    var p = $("#demo-pics-controls").find("span");
    p.eq(newImageIndex+1).addClass("selected");

  })

});