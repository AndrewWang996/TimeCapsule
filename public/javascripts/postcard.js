$(document).ready(function() {
    $('button.send').click(function(event) {
        var html =
            '<div align="center">' + 
            '<img src="' + 
            $('.pphoto').attr('src') + 
            '" height=200/>' +
            '<p style="font-family: \'Indie Flower\', cursive; font-size: 16pt">' +
            $('textarea[name="message"]').val() + 
            '</p></div>';
        $.post('/email', {
            from: $('input[name="from"]').val(),
            to: $('input[name="to"]').val(),
            email: $('input[name="email"]').val(),
            message: html //$('#postcard').html()
        }).done(function() {
            console.log('sent');
        });
    });
});
