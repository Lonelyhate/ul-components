const fixedBlock = document.querySelector('.filters-price'),
      filters = document.querySelector('.filters'),
      gutter = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gutter')),
      container = document.querySelector('.container'),
      offsetLeft = container.offsetLeft + gutter
      filtersOffsetTop = filters.offsetTop,
      filtersWidth = filters.offsetWidth,
      smallOffset = gutter

const fixedScrollBlock = () => {
    let scrollDistance = window.scrollY

    if(scrollDistance > (filtersOffsetTop - smallOffset) && scrollDistance <= (filters.offsetHeight + filtersOffsetTop)) {
        fixedBlock.style.left = `${offsetLeft}px`
        fixedBlock.style.width = `${filtersWidth}px`
        fixedBlock.classList.add('fixed')
        fixedBlock.classList.remove('absolute');
    } else {
        fixedBlock.style.left = '0px'
        fixedBlock.classList.remove('fixed')
        fixedBlock.style.width = `100%`
    }

    if (scrollDistance >= (filtersOffsetTop - smallOffset) + (filters.offsetHeight - fixedBlock.offsetHeight)) {
        fixedBlock.classList.add('absolute');
        fixedBlock.classList.remove('fixed')
        fixedBlock.style.width = `100%`
        fixedBlock.style.left = '0px'
    }
}

window.addEventListener('scroll', fixedScrollBlock)
