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

        var m = JSON.parse(e.data);

        if(m.message.type === 'name_message'){

            console.log(m.message.text.result);

            $('#status_name').text(m.message.text.result.name)

        }else if(m.message.type === 'poll_message'){

            console.log(m.message.text.result,(new Date())-t);
            t = new Date();

            var res = m.message.text.result;

            if(res === 'start'){
                clearTimer();
                startTimer();
            }else if(res === 'stop'){
                stopTimer();
            }
        }



    };

    leaderboardSocket.onclose = function(e) {
        console.error('Leaderboard socket closed unexpectedly');
    };


});