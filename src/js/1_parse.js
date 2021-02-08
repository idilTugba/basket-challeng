//parese JSON
let parseProduct = {
    loadProducts : function(){
        const xhr = new XMLHttpRequest();
        xhr.open('GET','./products.json',true);
        xhr.onload = function(){
            if(this.status === 200){
                let allProductsData = JSON.parse(this.responseText),
                    pathNAme = window.location.href.split('#')[1];
                if(pathNAme){
                    parseProduct.parseProductDetail(allProductsData,pathNAme);
                } else{
                    parseProduct.parseProductstoHtml(allProductsData);
                }
            }
        }
        xhr.send();
    },
    
    //Parse Products in Catalog
    parseProductstoHtml : function(allProductsData){
        let html = "";
        allProductsData.forEach(function(product){
            html += `<div class="product-catalogue__item">
                        <a id="${product.id}" href="product-detail.html#${product.id}">    
                            <div class="product-catalogue__item-img">
                                <img src="${product.files[0].name}" alt="">
                            </div>
                        </a>
                        <a href="product-detail.html#${product.id}">
                            <div class="product-catalogue__item-text">
                                <div class="product-catalogue__item-title">${product.name}</div>
                            </div>
                        </a>
                        <div class="price product-catalogue__item-price">                                
                            ${product.oldPrice ? 
                            `<span class="sale">SALE</span>
                            <span class="old-price">${product.oldPrice} ${product.birim}</span>` 
                            : ''}
                            <span>${product.price} ${product.birim}</span>
                        </div>
                        <button class="product-catalogue__item-basket add-basket">
                            <span>Sepete Ekle</span>
                            <span class="basket-success">Sepete Eklendi</span>
                        </button>
                    </div>`;

        });
                
        document.querySelector('#product-catalogue').innerHTML = html;
        
        //add basket with localstroage
        let addBasketButtons = document.querySelectorAll('button.product-catalogue__item-basket');
        addBasketButtons.forEach( function(button){
            button.addEventListener('click', function(){
                var ak = this.parentElement.children[0].getAttribute('id');
                setItemsToLS(allProductsData[ak-1]);
                this.classList.add('success');
                const that = this;
                setTimeout(function(){ 
                    that.classList.remove('success');
                }, 1000);
            });
        })
        

    },
    
    //parse JSON in Product Detail page 
    parseProductDetail : function(allProductsData,pathNAme){
        let productDetail = allProductsData[pathNAme-1],
            littleImages = productDetail.files;

        littleImages.forEach( (image,i) => {
            let imageContent = document.createElement('a'),
                imageItem = document.createElement('img');
            imageItem.setAttribute('src', image.name);
            imageItem.setAttribute('alt', productDetail.name);
            imageContent.setAttribute('herf','#');
            if(i==0){
                imageContent.className = "selected"
            }
            imageContent.appendChild(imageItem);
            document.querySelector('.image-list').appendChild(imageContent);
        })

        document.querySelector('.selected-image>img').setAttribute('src', littleImages[0].name);
        
        document.querySelector('.product-detail__title-aree>h3').innerHTML = productDetail.name;
        document.querySelector('.detail-area>p').innerHTML = productDetail.detail;
        document.querySelector('span.new-price').innerHTML = productDetail.price +' '+ productDetail.birim;
        if(productDetail.oldPrice){
            document.querySelector('span.old-price').innerHTML = productDetail.oldPrice;
        } else{
            document.querySelector('.price').classList.add('no-sale');
        }

        //add basket with localstroage
        let addBasketButton = document.querySelector('button.product-detail__basket');
        addBasketButton.addEventListener('click', function(){
            setItemsToLS(allProductsData[pathNAme-1]);
            console.log(pathNAme-1);
            this.classList.add('success');
            const that = this;
            setTimeout(function(){ 
                that.classList.remove('success');
            }, 1000);
        });

    },

    // get localStorage to set basket
    addBasket : function(){
        getItemsFromLS();
        let basketItem = '';
        items.forEach(function(item){
            
            basketItem += `<div data-id="${item.id}" class="user-basket__product">
                            <div class="user-basket__product-image">
                                <a href="product-detail.html#${item.id}" ><img alt="" src="${item.files[0].name}"></a>
                                <div>
                                    <a href="#" class="title">${item.name}</a>
                                </div>
                            </div>
                            <div class="user-basket__product-amount">
                                <span class="icon-minus"></span>
                                <input class="amount-input" type="number" value="${item.amount}" pattern="[0-9]*" min="1" max="10">
                                <span class="icon-plus"></span>
                            </div>
                            <div class="user-basket__product-price price">
                                ${item.oldPrice ?
                                `<span class="old-price">${item.oldPrice * item.amount} ${item.birim}</span>` : ''}
                                <span data-tax="%18" class="last-price">${item.price * item.amount} ${item.birim}</span>
                            </div>
                            <div class="user-basket__product-delete">
                                <span class="icon-trash"></span>
                            </div>
                        </div>`;

        document.getElementById('products-list').innerHTML = basketItem;
        })
        $.priceEvents.totalPriceEvent(items);
    },
   
}


let items;
//get LocalStorage
function getItemsFromLS(){
    if(localStorage.getItem('items') === null){
        items = [];
    }else{
        items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
}

//set LocalStorage and dont let get same product array
function setItemsToLS(item){
    item.amount = 1;
    items = getItemsFromLS();
    let n=0;
    if(items.length > 0){
        items.forEach(function(i){ 
            if(i.id != item.id){
                n++;
                if(n == items.length){
                    items.push(item);
                    console.log(items);
                    localStorage.setItem('items', JSON.stringify(items));
                }
            } else{
                i['amount'] = i['amount'] + 1;
                localStorage.setItem('items', JSON.stringify(items));
            }
        })
    } else {
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    }
}
