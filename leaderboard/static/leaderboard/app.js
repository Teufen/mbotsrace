$(function(){

   console.log('ready!');

   var leaderboardSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/leaderboard');

    leaderboardSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        console.log(message);
    };

    leaderboardSocket.onclose = function(e) {
        console.error('Leaderboard socket closed unexpectedly');
    };

});