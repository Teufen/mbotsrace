$(function(){

   console.log('ready!');

   var $laps = $('div#laps');

   setInterval(function(){
      $.get('/leaderboard', function(html) {
                $laps.html($(html).find('div#laps').children());
            });
   },500);

   var leaderboardSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/leaderboard');

    leaderboardSocket.onmessage = function(e) {
        console.log(e);
    };

    leaderboardSocket.onclose = function(e) {
        console.error('Leaderboard socket closed unexpectedly');
    };


});