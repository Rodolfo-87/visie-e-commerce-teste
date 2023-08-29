const BASE_API = 'https://dummyjson.com';
const API_PRODUCTS = 'https://dummyjson.com/products';
const ADD_CART = 'https://dummyjson.com/products/add';

window.allProducts = new Set();
window.wishList = new Set();
const minicart = document.querySelector('.vitrine-cart');    
const overlay = document.querySelector('.vitrine-overlay');    
const body = document.body;

const pageProducts = {
    formatReal: function( value ){
        var tmp = value+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
    },
    getProducts: async function ( url ){
        const response = await fetch( url );
        const data = await response.json();
    
        response.status === 200 && pageProducts.insertProductsInHTML( data.products )
    },
    createElementMain: function( products ){
        const element = document.createElement('div');
        element.classList.add('main');
        document.body.appendChild(element);

        pageProducts.createElementHTML( element, 'div', 'container', products )
    },
    createElementHTML: function( elementFather, tagHTML, className, products ){
        const element = document.createElement(tagHTML);
        element.classList.add( className );
        elementFather.appendChild(element)
        pageProducts.createVitrineHTML( className, products )
    },
    createVitrineHTML: function( className, products ){
        const container = document.querySelector('.' + className);
        if( container ){
            container.innerHTML += `
                <div class="vitrine"></div>
            `
        }  
        
        const vitrine = document.querySelector('.vitrine')
        
        products.map(( product )=>{            
            let idProduct = product.id
            let discountValue = ( (product.price * product.discountPercentage)/100 ).toFixed(2);
            let valueWithDiscount = product.price - discountValue
            let valueWithDiscountFormatReal = pageProducts.formatReal( valueWithDiscount.toFixed(2).replace('.', '') )
            let discount = product.discountPercentage.toFixed();
            let price = pageProducts.formatReal(product.price.toFixed(2).replace('.', '')) ;

            let discountActive = discount !== 0 ? 'is-active' : '';
            if( vitrine ){
                vitrine.innerHTML += `
                    <div class="vitrine-product">
                        <div class="vitrine-product__content"> 
                            <h3> ${product.brand} </h3>                           
                            <figure>
                                <img class="vitrine-product__image" src="${product.images[1] === undefined ? product.thumbnail : product.images[1] }" alt="${product.description}" />                        
                            </figure>                            
                            <h4 class="vitrine-product__title"> 
                                ${product.title} 
                            </h4>
                            <div class="vitrine-product__price-card">
                                <span class="vitrine-product__price ${discountActive}"> De: R$ ${ price } </span>

                                <div class="vitrine-discount-card">
                                    <span class="vitrine-product__discount-value"> Por: R$ ${  valueWithDiscountFormatReal  } - </span>
                                    <span class="vitrine-product__discount"> ${discount}%  </span>
                                </div>
                            </div>
                            <div class="vitrine-product__btn">
                                <a 
                                    data-id="${product.id}" 
                                    data-title="${product.title}" 
                                    data-price=${price}
                                    data-valueWithDiscount="${valueWithDiscountFormatReal}"
                                    data-image="${product.images[1] === undefined ? product.thumbnail : product.images[1] }"                                   
                                    class="vitrine-product__add">Adicionar ao Carrinho
                                </a> 
                                <a class="vitrine-product__favorite"
                                    data-id="${product.id}" 
                                    data-title="${product.title}" 
                                    data-price=${price}
                                    data-valueWithDiscount="${valueWithDiscountFormatReal}"
                                    data-image="${product.images[1] === undefined ? product.thumbnail : product.images[1] }"                                 
                                >                                    
                                    <svg class="vitrine-product__favorite-empty" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z" fill="#000"/>
                                    </svg>                                       
                                    <svg class="vitrine-product__favorite-not-empty is-hidden" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#000"/>
                                    </svg>                                                                 
                                </a> 
                            </div>                           
                        </div>
                    </div>
                `
            }          
        })
    },
    addCart: function(){
        const btnAddCart = document.querySelectorAll('.vitrine-product__add');       
        btnAddCart.forEach((item)=>{            
            item.addEventListener('click', clickBtn)           
    
            async function clickBtn( event ){
                window.scrollTo(0, 0);

                let target = event.currentTarget;
                let dataSet = target.dataset;
                let idProduct = +dataSet.id;
                let priceProduct = dataSet.price;
                let discountValueProduct = dataSet.valuewithdiscount;
                let titleProduct = dataSet.title;
                let imageProduct = dataSet.image;  

                const localStorageProduct = JSON.parse( localStorage.getItem('product') );

                let product = {
                    id: idProduct,
                    price: priceProduct,
                    discountValue: discountValueProduct,
                    title: titleProduct,
                    image: imageProduct,
                }                

                if( localStorageProduct !== null ){
                    localStorageProduct.map(( item )=>{
                        if( Number(item.id) === idProduct ){
                            product.quantity = item.quantity === null ? 1 : item.quantity +1 
                        }
                    })

                } else if( localStorageProduct === null ){
                    product.quantity = 1;
                }

                if( localStorageProduct !== null ){
                    localStorageProduct.filter(( item )=>{
                        if( item.id === idProduct ){                            
                            item.quantity = product.quantity
                            localStorage.setItem(`product`, JSON.stringify( localStorageProduct ))
                        } else{                            
                            product.quantity =1
                            window.allProducts = new Set(JSON.parse( localStorage.getItem('product') ))
                            window.allProducts.add(product)
                            localStorage.setItem(`product`, JSON.stringify( Array.from( window.allProducts ) ))
                        }
                    })
                } else {                    
                    window.allProducts.add(product)              
                    localStorage.setItem(`product`, JSON.stringify( Array.from( window.allProducts ) ))
                }                

                pageProducts.buildCart(idProduct)

                setTimeout(()=>{
                    minicart.classList.add('is-active');
                    body.classList.add('is-active');
                    overlay.classList.add('is-active');
                }, 200)


            }        
        })         
    
    },

    buildCart: function(idProduct){    
        const localStorageProduct = JSON.parse( localStorage.getItem('product') );
        let arrayProduct = [];
        let quantityGlob = 0;
        if( localStorageProduct ){
            arrayProduct.push(localStorageProduct);
            localStorageProduct.forEach( (product, index)=>{
                let elementID = document.querySelector(`.vitrine-cart__product-${product.id}`);  

                if( !elementID  && !isNaN(idProduct) ){
                    const elementProduct = document.createElement('div')
                    const elementFather = document.querySelector('.vitrine-cart__body');
                    elementFather.innerHTML += `  
                        <div class=" vitrine-cart__card vitrine-cart__product-${product.id}" title='${product.title}' data-cartid=${product.id}>
                            <figure class="vitrine-cart__figure">
                                <img class="vitrine-cart__image" src='${product.image.trim()}' alt="">
                            </figure>
                            <span class="vitrine-cart__title"> ${product.title} </span>
                            <span class="vitrine-cart__price"> De: R$ ${product.price} </span>
                            <span class="vitrine-cart__discount-price"> Por: R$ ${product.discountValue} </span>
                            <span class="vitrine-cart__quantity" data-quantity=${product.quantity} >Qtd ${product.quantity}</span>  
                            <div class="vitrine-cart__remove" data-cartid=${product.id}>
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"/></svg>                               
                            </div>
                        </div>          
                    `
                } else if ( elementID && !isNaN(idProduct) ) {                    
                    setTimeout(()=>{                        
                        quantityGlob++
                        if ( quantityGlob == 1){                              
                                                     
                            const quantityElement = document.querySelector(`.vitrine-cart__product-${idProduct}`).children[4];
                            const quantity = +quantityElement.innerText.replace(/\D/g, '');
                            
                            let duplicate = product.id == idProduct;
                            if( !duplicate ){
                                quantityElement.innerText = `Qtd  ${ Number( quantityElement.innerHTML.replace(/\D/g, '') ) == 1 ? quantity : quantity+1}`;
                            } else {
                                quantityElement.innerText = `Qtd ${ quantity+1}`;
                            }
                        }
                       
                    }, 600)
                    
                }

                if( isNaN(idProduct) ){                    
                    const elementProduct = document.createElement('div')
                    const elementFather = document.querySelector('.vitrine-cart__body');    
    
                    if( !elementID  ){                        
                        elementFather.innerHTML += `  
                            <div class=" vitrine-cart__card vitrine-cart__product-${product.id}" title='${product.title}' data-cartid=${product.id}>
                                <figure class="vitrine-cart__figure">
                                    <img class="vitrine-cart__image" src='${product.image.trim()}' alt="">
                                </figure>
                                <span class="vitrine-cart__title"> ${product.title} </span>
                                <span class="vitrine-cart__price"> De: R$ ${product.price} </span>
                                <span class="vitrine-cart__discount-price"> Por: R$ ${product.discountValue} </span>
                                <span class="vitrine-cart__quantity" data-quantity=${product.quantity} >Qtd ${product.quantity}</span>  
                                <div class="vitrine-cart__remove" data-cartid=${product.id}>
                                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"/></svg>                               
                                </div>
                            </div>          
                        `
                    }

                    setTimeout(()=>{
                        minicart.classList.add('is-active');
                        body.classList.add('is-active');
                        overlay.classList.add('is-active');
                    }, 200)                    

                    return false
                }       
            } )
        }

        setTimeout(()=>{
            pageProducts.deleteItem();       
            pageProducts.emptyCart();       
        }, 200)
    },

    clickCart:function(){
        const btnCart = document.querySelector('.vitrine-header__link.js-cart'); 
        btnCart.addEventListener('click', clickBtnCart)
        
        function clickBtnCart(e){
            e.preventDefault();
            const localStorageProduct = JSON.parse( localStorage.getItem('product') ).length;
            localStorageProduct > 0 && pageProducts.buildCart( 'is-click-cart' )
        }

        setTimeout(()=>{
            pageProducts.deleteItem();          
            pageProducts.emptyCart();          
        }, 200)
    },

    deleteItem:function(){
        const btnDelete = document.querySelectorAll('.vitrine-cart__remove');    

        Array.from(btnDelete).forEach(( item )=>{
            item.addEventListener('click', excluiItemRow)
        })    
        
        function excluiItemRow( { currentTarget } ){            
            let idItemRow = +currentTarget.dataset.cartid;
            const itemRow = document.querySelector(`.vitrine-cart__product-${idItemRow}`);
            
            let title = itemRow.title;
            let text = `Deseja realmente excluir o item?`;
            if (confirm(text) == true) {
               itemRow.remove();
               setTimeout(()=>{
                   localStorage.getItem('product').length === 2 && localStorage.removeItem('product')
               }, 800)
            }         
            

            let localStorageProducts = JSON.parse( localStorage.getItem('product') )
            let newListProduct = []
            localStorageProducts.filter((item)=>{
                if( item.id !== idItemRow ){
                    newListProduct.push(item)
                }
            })            
            localStorage.setItem('product', JSON.stringify(newListProduct));
        }       
    },

    emptyCart:function(){
        const btnEmptyCart = document.querySelector('.vitrine-cart__clear');  

        btnEmptyCart.addEventListener('click', emptyItens)
        
        
        function emptyItens(  ){            
            const itens = Array.from( document.querySelectorAll('.vitrine-cart__card') )
            itens.forEach( (item)=> item.remove() )
            localStorage.removeItem('product')
            window.allProducts = new Set();
        }        
    },

    insertProductsInHTML: function( products ){
        pageProducts.createElementMain( products );
    }, 

    clickWishList: function(){
        const btnFavorite = document.querySelectorAll('.vitrine-product__favorite');
        const localStorageWishList = JSON.parse(localStorage.getItem('wishlist'));
    
        btnFavorite.forEach(( item )=>{
            item.addEventListener('click', addWishilist)
        })
        
        
        function addWishilist( { target } ){   
            const elementFatherWhisilist = target.parentElement
            let heartEmptyElement = elementFatherWhisilist.children[1];
        
            if( heartEmptyElement !== undefined ){
                 heartEmptyElement.classList.contains('is-hidden') ? heartEmptyElement.classList.remove('is-hidden') : '';

                 let target = event.currentTarget;
                 let dataSet = target.dataset;
                 let idProduct = +dataSet.id;
                 let priceProduct = dataSet.price;
                 let discountValueProduct = dataSet.valuewithdiscount;
                 let titleProduct = dataSet.title;
                 let imageProduct = dataSet.image;  
 
                 const localStorageProduct = JSON.parse( localStorage.getItem('wishlist') );
 
                 let product = {
                     id: idProduct,
                     price: priceProduct,
                     discountValue: discountValueProduct,
                     title: titleProduct,
                     image: imageProduct,
                 }  

                 let exist = false;

                if( localStorageWishList !== undefined || localStorageWishList !== null ){ 

                    if( localStorageWishList != undefined ){
                        localStorageWishList.find(( item )=>{
                            if( idProduct == item.id ){
                                exist = true                                
                            } 
                        })             

                    }        

                    if( localStorageWishList !== null ){                        
                        window.wishList.add(localStorageWishList)
                    }

                    if( !exist ) {
                        window.wishList.add(product);
                        localStorage.setItem('wishlist', JSON.stringify( Array.from(window.wishList)  )) 
                    }                    
                }
                              
            }
        
            if( elementFatherWhisilist.classList.contains('vitrine-product__favorite-not-empty') ){
                elementFatherWhisilist.classList.add('is-hidden')

                if( Object.keys( JSON.parse(localStorage.getItem('wishlist')) ).length == 1 ){                    
                    localStorage.removeItem('wishlist')   
                }         

            }
        }   
    }
}

const pageWishList = {
    addItens: function(){
        const whishlist = document.querySelector('.whishlist__container');
        const localStorageWhishlist = JSON.parse( localStorage.getItem('wishlist') )

        if( localStorageWhishlist === null ){
            whishlist.innerHTML = `
                </h2> Não há itens no favoritos </h2>
            `
        }

        else if( localStorageWhishlist !== null && localStorageWhishlist.length == 1 ){
            whishlist.innerHTML += `
                <div class="whishlist__item" data-wishid=${localStorageWhishlist[0].id}>
                    <figure class="whishlist__image">
                        <img class="whishlist__image-src" src="${localStorageWhishlist[0].image}" alt="">
                        <figcaption class="whishlist__image-title"> </figcaption>
                    </figure>
                    <span class="whishlist__title">${localStorageWhishlist[0].title}</span>
                    <span class="whishlist__price">${localStorageWhishlist[0].price}</span>
                    <span class="whishlist__discount-value">${localStorageWhishlist[0].discountValue}</span>    
                </div>           
            `             
            
        } else {
            Array.from(localStorageWhishlist).map( (wish) =>{                
                let image = wish.image ?? wish.image;
                let title = wish.title ?? wish.title;
                let price = wish.price ?? wish.price;
                let discountValue = wish.discountValue ?? wish.discountValue;             
       
                whishlist.innerHTML += `
                    <div class="whishlist__item" data-wishid=${wish.id}>
                        <figure class="whishlist__image">
                            <img class="whishlist__image-src" src="${image}" alt="">
                            <figcaption class="whishlist__image-title"> </figcaption>
                        </figure>
                        <span class="whishlist__title">${title}</span>
                        <span class="whishlist__price">${price}</span>
                        <span class="whishlist__discount-value">${discountValue}</span>    
                    </div>           
                    `               
            })
        }

        
        Array.from( document.querySelectorAll('.whishlist__item')).forEach(( el )=>{
            if( el.dataset.wishid === 'undefined' ){
                el.remove()
            }
        })            
       
    }
}

if( window.location.pathname.indexOf('/index.html') !== -1 ){
    pageProducts.getProducts(API_PRODUCTS);
}

document.addEventListener('click', function (el) {
    const target = el.target;
    let overlayAtive = target.classList.contains('is-active');

    if( overlay && overlayAtive ){
        setTimeout(()=>{
            minicart.classList.remove('is-active');
            body.classList.remove('is-active');
            overlay.classList.remove('is-active');
        }, 200)
    }
})

window.onload = ()=>{
    setTimeout(()=>{
        if( window.location.pathname.indexOf('/index.html') !== -1 ){            
            pageProducts.addCart();
            pageProducts.clickCart();
            pageProducts.clickWishList();
        } else if( window.location.pathname.indexOf('/whishList.html') !== -1 ){
            pageWishList.addItens()
        }

    }, 1000)
}


