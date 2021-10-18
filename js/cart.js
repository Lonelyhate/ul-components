document.addEventListener('DOMContentLoaded', () => {
    const productBtn = document.querySelectorAll('.product__btn')
    const cartProductList = document.querySelector('.cart-content__list')
    const cart = document.querySelector('.cart')
    const cartQuantity = document.querySelector('.cart__quantity')
    const fullPrice = document.querySelector('.fullprice')
    const orderModalProductOpenProd = document.querySelector('.order-modal__btn')
    const orderModalList = document.querySelector('.order-modal__list')
    let price = 0
    let productArray = []
    
    const randomId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    
    const priceWithoutSpaces = (str) => {
        return str.replace(/\s/g, '');
    };
    
    const normalPrice = (str) => {
        return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    };
    
    const plusFullPrice = (currentPrice) => {
        return price += currentPrice
    }
    
    const minusFullPrice = (currentPrice) => {
        return price -= currentPrice
    }
    
    const printFullPrice = () => {
        fullPrice.textContent = `${normalPrice(price)} Р`
    }
    
    const printQuantity = () => {
        let length = cartProductList.querySelector('.simplebar-content').children.length
        cartQuantity.textContent = length
        length > 0 ? cart.classList.add('active') : cart.classList.remove('active')
    }
    
    const generateCartProduct = (img, title, price, id) => {
        return `
        <li class="catr-content__item">
            <article class="cart-content__product cart-product" data-id="${id}">
                <img src="${img}" alt="" class="cart-product__img">
                <div class="cart-product__text">
                    <h3 class="cart-product__title">${title}</h3>
                    <span class="cart-product__price">${normalPrice(price)} Р</span>
                </div>
                <button class="cart-product__delete" aria-label="Удалить товар"></button>
            </article>
        </li>
        `
    }
    
    const deleteProduct = (productParent) => {
        let id = productParent.querySelector('.cart-product').dataset.id;
        document.querySelector(`.product[data-id="${id}"]`).querySelector('.product__btn').disabled = false
    
        let currentPrice = parseInt(priceWithoutSpaces(productParent.querySelector('.cart-product__price').textContent))
        minusFullPrice(currentPrice)
        printFullPrice()
        productParent.remove()
        printQuantity()
        updateStorage()
    }


    
    productBtn.forEach((el, i) => {
        let randomId = 0;
        el.closest('.product').setAttribute('data-id', i)
        el.addEventListener('click', e => {
            let self = e.currentTarget;
            let parent = self.closest('.product')
            let id = parent.dataset.id
            let img = parent.querySelector('.image-swtich__item img').getAttribute('src')
            let title = parent.querySelector('.product__title').textContent
            let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.product-price__current').textContent))
    
            plusFullPrice(priceNumber)
            printFullPrice()
            cartProductList.querySelector('.simplebar-content').insertAdjacentHTML('afterbegin', generateCartProduct(img, title, priceNumber, id))
            printQuantity()
            updateStorage()
            self.disabled = true
        })
    })
    
    cartProductList.addEventListener('click', e => {
        if (e.target.classList.contains('cart-product__delete')) {
            deleteProduct(e.target.closest('.catr-content__item'))
        }
    })
    
    let flag = 0
    orderModalProductOpenProd.addEventListener('click', e => {
        if (flag == 0) {
            orderModalProductOpenProd.classList.add('open')
            orderModalList.style.display = 'block'
            flag = 1
        } else {
            orderModalProductOpenProd.classList.remove('open')
            orderModalList.style.display = 'none'
            flag = 0
        }
    })
    
    const generateModalProduct = (img, title, price, id) => {
        return `
        <li class="order-modal__item">
            <article class="order-modal__product order-product" data-id="${id}">
                <img src="${img}" alt="" class="order-product__img">
                <div class="order-product__text">
                    <h3 class="order-product__title">${title}</h3>
                    <div class="order-product__price">${normalPrice(price)} Р</div>
                </div>
                <button class="order-product__delete">Удалить</button>
            </article>
        </li>
        `
    }
    
    const modal = new GraphModal({
        isOpen: (modal) => {
            console.log('opened')
            let array = cartProductList.querySelector('.simplebar-content').children
            let fullprice = fullPrice.textContent
            let length = array.length
    
            document.querySelector('.order-modal__sum span').textContent = fullprice
            document.querySelector('.order-modal__quantity span').textContent = length + ' шт'
            for (item of array) {
                let id = item.querySelector('.cart-product').dataset.id
                let title = item.querySelector('.cart-product__title').textContent
                let priceString = priceWithoutSpaces(item.querySelector('.cart-product__price').textContent)
                let img = item.querySelector('.cart-product__img').getAttribute('src')
                orderModalList.insertAdjacentHTML('afterbegin', generateModalProduct(img, title, priceString, id))
    
                let obj = {}
                obj.title = title
                obj.price = priceString
                productArray.push(obj)
            }
        },
        isClose: () => {
            console.log('closed')
        }
    })
    
    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            body: data
        })
    
        return await res.text()
    }
    
    document.querySelector('.order').addEventListener('submit', e => {
        e.preventDefault()
        let self = e.currentTarget
        const message = {
            success: 'Ваш заказ успешно принят',
            fail: 'Что то пошло не так', 
            lodading: 'Загрузка'
        }
    
        let statusMessage = document.createElement('div')
        statusMessage.textContent = message.lodading
        statusMessage.style.cssText = `
            text-align: center;
            margin-bottom: 5px;
        `
        self.insertAdjacentElement('afterbegin', statusMessage)
    
        let a = []
        let formData = new FormData(self)
        let name = self.querySelector('[name="Имя"]').value
        let tel = self.querySelector('[name="Телефон"]').value
        let mail = self.querySelector('[name="Почта"]').value
        a.push('Товары', JSON.stringify(productArray))
        a.push('Имя', name)
        a.push('Телефон', tel)
        a.push('Почта', mail)
    
        postData('../server.php', formData)
        .then((data) => {
            console.log(data)
            statusMessage.textContent = message.success
        })
        .catch(() => {
            statusMessage.textContent = message.fail
        })
        .finally(() => {
            setTimeout(() => {
                statusMessage.remove()
            }, 5000)
        })
    
        
    
        
    
        self.reset()
    })  

    const countSum = () => {
        document.querySelectorAll('.catr-content__item').forEach(el => {
            price += parseInt(priceWithoutSpaces(el.querySelector('.cart-product__price').textContent))
        })

    }
    
    const initialState = () => {
        if (localStorage.getItem('products') !== null) {
            cartProductList.querySelector('.simplebar-content').innerHTML = localStorage.getItem('products')
            printQuantity()
            countSum()
            printFullPrice()

            document.querySelectorAll('.cart-content__product').forEach(el => {
                let id = el.dataset.id
                document.querySelector(`.product[data-id="${id}"]`).querySelector('.product__btn').disabled = true
            })
        }
    }
    initialState()
    
    const updateStorage = () => {
        let parent = cartProductList.querySelector('.simplebar-content')
        let html = parent.innerHTML
        html = html.trim()
        if (html.length) {
            localStorage.setItem('products', html)
        } else {
            localStorage.removeItem('products')
        }
    }

    document.querySelector('.order-modal__content').addEventListener('click', e => {
        if(e.target.classList.contains('order-product__delete')) {
            let id = e.target.closest('.order-modal__product').dataset.id
            let cartProduct = document.querySelector(`.cart-content__product[data-id="${id}"]`).closest('.catr-content__item')
            deleteProduct(cartProduct)
            e.target.closest('.order-modal__product').remove()
        }
    })


})