
    $.noContent = function() {
        if($('#products-list').children().length > 0 ){
            $('section.user-basket').removeClass('no-product');
        } else{
            $('section.user-basket').addClass('no-product');
        }
    } 
