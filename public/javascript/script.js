$(document).ready(function(){
    $('.scrolldown').click(function(e){
        e.preventDefault();
        var scrollto = $(this).attr('href');
        var height = $(scrollto).offset().top - $('.navbar').height();
    
        $("html, body").animate({ scrollTop: height }, 600, "linear");
    });
    
    
    $(".dropdown-menu").on('click', 'li a', function(){
        $(this).parent().parent().prev().html('<span class="ef-chosen">'+$(this).html()+ '</span> <span class="caret"></span>');

        var type = $('.dropdown-type > .ef-chosen').html();
        var minRating = $('.dropdown-rating > .ef-chosen').find('.fa-star').length;

        $('.ef-item-container > .ef-item').filter(function(){
            removeWrongEffects($(this), type, minRating);
        });
    });

    function removeWrongEffects(elem, type, rating){
        //check both type and rating
        if(elem.find('.ef-rating').find('.fa-star').length >= rating){
            if(elem.find('.ef-type').html() == type || type == "All types"){
                elem.css("display","block");
            }
            else {
                elem.css("display","none");
            }
        }
        else {
            elem.css("display","none");
        }
    }

    /*$('.dropdown-menu.dropdown-type').on('click', 'li a', function(){
        var effect = $(this).html();
       // alert(effect);
        $('.ef-item-container > .ef-item').filter(function(){
           removeWrongType($(this),effect);
        });
    });

    function removeWrongType(elem, eff){
        if(elem.find('.ef-type').html() != eff){
            elem.css("display","none");
        }

    }

    $('.dropdown-menu.dropdown-rating').on('click', 'li a', function(){
        var rating = $(this).find('.fa-star').length;
        //alert(rating);

        $('.ef-item-container > .ef-item').filter(function(){
            //alert($(this).find('.ef-rating').find('.fa-star').length);
            removeWrongRating($(this), rating);
        });
    });

    function removeWrongRating(elem, rating){
        if(elem.find('.ef-rating').find('.fa-star').length < rating){
            elem.css("display","none");
        }
    }*/


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