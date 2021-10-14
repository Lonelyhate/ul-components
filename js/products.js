const products = document.querySelectorAll('.product')

if (products) {
    products.forEach(el => {
        let currentProduct = el
        const imageSwitchItems = el.querySelectorAll('.image-swtich__item')
        const imagePagination = el.querySelector('.image-pagination')

        if(imageSwitchItems.length > 1) {
            imageSwitchItems.forEach((el, index) => {
                el.setAttribute('data-index', index)
                imagePagination.innerHTML += `
                <li class="image-pegination__item ${index == 0 ? 'image-pegination__item--active' : ''}" data-index="${index}"></li>
                `
                el.addEventListener('mouseenter', e => {
                    currentProduct.querySelectorAll('.image-pegination__item').forEach(el => {el.classList.remove('image-pegination__item--active')})
                    currentProduct.querySelector(`.image-pegination__item[data-index="${e.currentTarget.dataset.index}"]`).classList.add('image-pegination__item--active')
                })

                el.addEventListener('mouseleave', e => {
                    currentProduct.querySelectorAll('.image-pegination__item').forEach(el => {el.classList.remove('image-pegination__item--active')})
                    currentProduct.querySelector(`.image-pegination__item[data-index="0"]`).classList.add('image-pegination__item--active')
                })
            })
        }
    })
}