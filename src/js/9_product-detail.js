$(document).ready(function(){
    setTimeout(function() { 
        $('.image-list>a').click(function(e){
            e.preventDefault();
            if(!$(this).hasClass('selected')){
                var src = $(this).children().attr('src');
                $('.selected-image>img').attr('src', src);
                $('.image-list>a').removeClass('selected');
                $(this).addClass('selected');
            }
        })
    }, 200);
})