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
        var m = JSON.parse(e.data);

        if(m.message.type === 'name_message'){

            console.log(m.message.text.result);
        }

        //console.log(JSON.parse(e.data).message.text.result);
    };

    leaderboardSocket.onclose = function(e) {
        console.error('Leaderboard socket closed unexpectedly');
    };

    $('[name=selectPlayer]').click(function(evt){

        $('td:first-child').text('');

        $('[value=state_'+$(evt.target).data('id')+']').text('*');

        console.log();

        leaderboardSocket.send(JSON.stringify({
            type: 'name_message',
            text: {
                pid: $(evt.target).data('id'),
                name: $(evt.target).data('nick')
            }
        }));
    });

});