
//=============================================
//           JQUERY DOCUMENT READY            =
//=============================================

$.priceEvents = {
    prices : $('.user-basket__product-price>span.last-price'),
    totalProductsPrices : $('.user-basket__order-summary-products-total>span'),
    totalProductsTax : $('.user-basket__order-summary-tax>span'),
    cargoPrice : $('.user-basket__order-summary-cargo>span'),
    totalPrice : $('#total-price'),
    
    //calculate all price & tax 
    totalPriceEvent: function(items){
        
        let allPrice = 0, allTax = 0, birim, total, cargo;
        
        $.each(items, function(i,item){
            let taxPrice = item.price - (item.price / (item.tax.slice(1)/100 + 1));
            allPrice += (item.price - taxPrice)*item.amount;
            allTax += taxPrice*item.amount;
            allPrice = parseInt(allPrice*100)/100;
            allTax = parseInt(allTax*100)/100;
            cargo = parseInt(item.cargo*100)/100;
            total = parseInt((allTax + allPrice + cargo)*100)/100;
            birim = item.birim;
        })

        $.priceEvents.totalProductsPrices.text(allPrice+' '+birim);
        $.priceEvents.totalProductsTax.text(allTax+' '+birim);
        $.priceEvents.cargoPrice.text(cargo+' '+birim);
        $.priceEvents.totalPrice.text(total+' '+birim);
        
    },

    productPriceEvent: function(that,productAmount){
        $(that).parent().next().find('span.last-price').split(' ')[0];
    }
}


$(document).ready(function(){

    //input[type=number] control
    const numberInput = document.querySelectorAll('input[type=number]');

    numberInput.forEach(function(input){
        input.addEventListener("keydown", function(e) {
            // prevent: "e", "=", ",", "-", "."
            if ([69, 187, 188, 189, 190].includes(e.keyCode)) {
            e.preventDefault();
            }
        })
    })

    $(function () {
        $("input[type=number]").keydown(function () {
          // Save old value
          if (!$(this).val() || (parseInt($(this).val()) <= 10 && parseInt($(this).val()) > 0))
          $(this).data("old", $(this).val());
        });
        $("input[type=number]").keyup(function () {
          // Check correct, else revert back to old value
          if (!$(this).val() || (parseInt($(this).val()) <= 10 && parseInt($(this).val()) > 0))
            ;
          else
            $(this).val($(this).data("old"));
        });
    });

    
    //change amount just in input
    $('.user-basket__product-amount>span').click(function(){
        const thisInput = $(this).parent().find('input'),
            n = $(this).parents('.user-basket__product').attr('data-id');
        let newArray = items,
            inputValue = thisInput.val();
        

        if($(this).hasClass('icon-minus') && inputValue > 1){
            thisInput.val(--inputValue);
        } else if($(this).hasClass('icon-plus') && inputValue < 10){
            thisInput.val(++inputValue);
        }

        const thisClick = $(this);
        $.each(newArray, function(index,item){
            if(item.id === parseInt(n)){
              item.amount = inputValue;
              thisClick.parent().next().find('span.last-price').text(item.amount*item.price+' '+item.birim);
              if(item.oldPrice){
                thisClick.parent().next().find('span.old-price').text(item.amount*item.oldPrice+' '+item.birim);
              }
            }
        })
        items = newArray;
        localStorage.setItem('items', JSON.stringify(items));
        $.priceEvents.totalPriceEvent(items);

    })
    
    
    //delete product in basket
    $('.user-basket__product-delete>span.icon-trash').click(function(){
        const n = $(this).parents('.user-basket__product').attr('data-id');
        const updatedItems = items.filter(item => item.id !== parseInt(n));
        items = updatedItems;
        
        localStorage.setItem('items', JSON.stringify(items));
        $.priceEvents.totalPriceEvent(items);
        $(this).parents('.user-basket__product').remove();
        
        $.noContent();
    })
    
    
});

//=============================================
//-----  End of JQUERY DOCUMENT READY   -----//
//=============================================
