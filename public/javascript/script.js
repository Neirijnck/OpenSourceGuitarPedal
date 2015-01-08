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
            if(elem.find('.ef-type').html() == '<span class="fa fa-folder-open"></span> '+type || type == "All types"){
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


    var socket = io();

    console.log(userName);
    socket.emit('login', userName);

    $('#chatForm').submit(function()
    {
        //var obj = {name: user.name, msg: $('#m').val()};
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(data)
    {
        var obj = JSON.parse(data);
        showMessage(obj);
    });

    socket.on('nrClients', function(nrClients)
    {
        $('#nrClients').text('People online:  ' + nrClients);
    });

    function scrollToBottom () {
        $("#messagesDiv").animate({scrollTop: $("#messagesDiv")[0].scrollHeight}, 200);
    }

    function showMessage(obj)
    {
        var li = document.createElement('li');
        li.className = "media";

        var media_body = document.createElement('div');

        var media = document.createElement('div');
        media.className = "media";

        var triangle = document.createElement('span');
        triangle.className = "media-object-triangle";

        media.appendChild(triangle);

        var avatar = document.createElement('img');
        avatar.src = obj.user.photo;
        avatar.className = "media-object img-square";
        avatar.alt = obj.user.name;
        avatar.title = obj.user.name;

        media.appendChild(avatar);

        var media_body_message = document.createElement('div');
        media_body_message.className = "media-body";
        media_body_message.appendChild(document.createTextNode(obj.msg));

        var br = document.createElement('br');
        media_body_message.appendChild(br);

        var author = document.createElement('small');
        author.className = "text-muted";
        var date = new Date();
        author.appendChild(document.createTextNode((date.getHours() < 10 ? '0' : '') + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()));
        media_body_message.appendChild(author);

        media.appendChild(media_body_message);
        media_body.appendChild(media);
        li.appendChild(media_body);

        document.getElementById('messages').appendChild(li);

        scrollToBottom();
    }

    $('.ef-rating').on('click', '.rating', function () {
        if($(this).parent().hasClass('canRate')) {
            $(this).parent().attr('class','ef-rating');
            var elem = $(this);
            var score = elem.index() + 1;
            elem = elem.parent();
            var id = elem.parent().next().find('input[type="hidden"]').attr('value');
            var ratings = elem.children('.timesRated').text().split(" ")[1];
            var prevScore = elem.children('.ratinghidden').attr('value');
            var newScore = 0;
            newScore = ratings * prevScore;
            newScore += score;
            ratings = parseFloat(ratings) + 1;
            newScore = newScore / ratings;

            $.ajax({
                url: '/effects',
                type: 'PUT',
                data: "id=" + id + "&rating=" + newScore,
                success: function (response) {
                }
            });

            elem.children('.fa-star, .fa-star-o, .fa-star-half-empty').remove();
            var i;
            var html = "";
            var count = 0;
            if (newScore >= 1) {
                for (i = 0; i < newScore; i++) {
                    html += '<span class="rating fa fa-star"><span>';
                    count++;
                }
            }
            if (newScore % 1 > 0.25 && newScore % 1 < 0.75) {
                html += '<span class="rating fa fa-star-half-empty"><span>';
                count++;
            } else if (newScore % 1 > 0.75) {
                html += '<span class="rating fa fa-star"><span>';
                count++;
            }

            while (count < 5) {
                html += '<span class="rating fa fa-star-o"><span>';
                count++;
            }
            elem.prepend(html);

            elem.children('.timesRated').text('( ' + ratings + ' )');
            elem.children('.ratinghidden').attr('value', newScore);
        }
    });

});