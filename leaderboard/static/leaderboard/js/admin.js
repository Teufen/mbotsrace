$(function(){

   var $form = $('form#addPlayer');
   var $players = $('tbody#players');

    $form.submit(function(evt){
        evt.preventDefault();

        var formData = $form.serialize();

        $.post('/leaderboard/api/player/new/',formData, function(res){
            console.log(res);

            $.get('/leaderboard/admin', function(html) {
                $players.html($(html).find('tbody#players').children());
            });
            $form[0].reset();
        });

    });


    var leaderboardSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/leaderboard');

    leaderboardSocket.onmessage = function(e) {
        console.log(JSON.parse(e.data).message.text.result);
    };

    leaderboardSocket.onclose = function(e) {
        console.error('Leaderboard socket closed unexpectedly');
    };

});