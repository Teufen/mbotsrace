$(function(){

    var time = 0;
    var currentPlayer = null;

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
        }else if(m.message.type === 'poll_message'){

            var res = m.message.text.result;

            if(res === 'start'){
                clearTimer();
                startTimer();
            }else if(res === 'stop'){
                stopTimer();
            }
        }

        //console.log(JSON.parse(e.data).message.text.result);
    };

    leaderboardSocket.onclose = function(e) {
        console.error('Leaderboard socket closed unexpectedly');
    };

    $('body').on('click','[name=selectPlayer]',function(evt){

        $('td:first-child').text('');

        $('[value=state_'+$(evt.target).data('id')+']').text('*');

        currentPlayer = $(evt.target).data('id');

        leaderboardSocket.send(JSON.stringify({
            type: 'name_message',
            text: {
                pid: $(evt.target).data('id'),
                name: $(evt.target).data('nick')
            }
        }));
    });

    function clearTimer(){
        time = 0;
        console.log(time);
    }

    function startTimer(){
        time = new Date();
        console.log(time);
    }

    function stopTimer(){
        var current = new Date();
        var f = current - time;
        console.log(f);

        addNewLap(f);
    }

    function addNewLap(time){

        if(!(currentPlayer === null || time === 0)) {
            var d = {
                player: currentPlayer,
                time: time
            };

            $.post('/leaderboard/api/lap/new/', d, function (res) {
                console.log(res);
            });
        }
    }

});