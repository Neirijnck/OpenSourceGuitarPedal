$(document).ready(function(){
    $('.nav').click(function(e){
        e.preventDefault();
        var scrollto = $(this).attr('href');
        var height = $(scrollto).offset().top - $('.navbar').height();
        
        $("html, body").animate({ scrollTop: height }, 600, "linear");
    });

    $(".dropdown-menu").on('click', 'li a', function(){
        $(this).parent().parent().prev().html($(this).html()+ ' <span class="caret"></span>');
    });


});