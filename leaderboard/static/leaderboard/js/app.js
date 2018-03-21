$(function(){

   console.log('ready!');

   var $laps = $('div#laps');

   setInterval(function(){
      $.get('/leaderboard', function(html) {
                $laps.html($(html).find('div#laps').children());
            });
   },500);

});