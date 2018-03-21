$(function(){

   console.log('ready!');

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