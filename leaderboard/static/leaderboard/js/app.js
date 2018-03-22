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

   var t = new Date();

    leaderboardSocket.onmessage = function(e) {

        console.log(JSON.parse(e.data).message.text.result,(new Date())-t);
        t = new Date();
    };

    leaderboardSocket.onclose = function(e) {
        console.error('Leaderboard socket closed unexpectedly');
    };


});