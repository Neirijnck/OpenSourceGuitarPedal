$(document).ready(function(){
    $('.scrolldown').click(function(e){
        e.preventDefault();
        var scrollto = $(this).attr('href');
        var height = $(scrollto).offset().top - $('.navbar').height();
    
        $("html, body").animate({ scrollTop: height }, 600, "linear");
    });
    
    
    $(".dropdown-menu").on('click', 'li a', function(){
        $(this).parent().parent().prev().html($(this).html()+ ' <span class="caret"></span>');
    });


    var socket = io.connect("http://127.0.0.1:8080/");

    $('form').submit(function()
    {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg)
    {
        $('#messages').append($('<li>').text(msg));
    });


});