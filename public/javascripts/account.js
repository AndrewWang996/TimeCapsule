$(document).ready(function() {
    $('img.theme').click(function(event) {
        $.post('/account/theme', {
            theme: event.target.id
        }).done(function() {
            console.log("theme set");
            $('img.theme').removeClass('selected');
            $(event.target).addClass('selected');
        });
    });


});
