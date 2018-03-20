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


});