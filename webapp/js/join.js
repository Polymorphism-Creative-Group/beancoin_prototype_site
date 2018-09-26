/* global PROJECT, JOIN */

$(() => {
   $('title').text(PROJECT.TITLE_MAIN + ' | ' + PROJECT.TITLE_ENGLISH);
   $('h1').text(PROJECT.TITLE_MAIN);
   $('h2').text(PROJECT.SUBTITLE);
   $('h3').text('Ver.' + PROJECT.VERSION);
   $('h1').css({
      'font-family': JOIN.FONT,
      color: JOIN.TITLE_COLOR
   });
   $('h2').css({
      'font-family': JOIN.FONT,
      color: JOIN.TITLE_COLOR
   });
   $('h3').css({
      color: JOIN.TITLE_COLOR
   });
   $('.myButton').css('font-family', JOIN.FONT);
   $('#logo').attr('src', PROJECT.LOGO_PATH);

   var socket = io({
      query: {
         role: 'umbra'
      }
   });

   $("#search").keyup(function (event) {
      if (event.keyCode === 13) {
         $("#query").click();
      }
   });
   $("#search").focus(function (event) {
      $("#message").text(null);
   });
   $('#query').click(function (event) {
      var text = $('#search').val().trim();
      if (text.length > 0) {
         $('#query').attr('disabled', true);
         $("#search").attr('disabled', true);
         $('#message').text('處理中...');
         socket.emit("query", {
            client: socket.id,
            text: text
         });
      }
   });
   socket.on('message', function (data) {
      if (data.user === socket.id) {
         $('#query').attr('disabled', false);
         $("#search").attr('disabled', false);
         $('#message').text(data.message);
         $("#search").val(null);
      }
   });
});
//        const WT = window.screen.availWidth - 10, HT = window.screen.availHeight;
function resizeImage()
{
   var window_height = document.body.clientHeight;
   var window_width = document.body.clientWidth;
   var image_width = document.images[0].width;
   var image_height = document.images[0].height;
   var height_ratio = image_height / window_height;
   var width_ratio = image_width / window_width;

   if (height_ratio > width_ratio)
   {
      document.images[0].style.width = "auto";
      document.images[0].style.height = "75%";
   } else
   {
      document.images[0].style.width = "75%";
      document.images[0].style.height = "auto";
   }

   if (document.body.clientWidth > 300)
   {
      document.images[0].style.width = 300;
      document.images[0].style.height = 300;
   }
   $('.box').css('width', document.images[0].style.width * 1.1);
   $('.container-1').css('width', document.images[0].style.width * 1.1);
   $('#search').css('width', document.images[0].style.width * 1.1);
}