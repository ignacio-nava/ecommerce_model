const carouselItems = document.querySelectorAll('.carousel-item')
const carouselNavigators = document.querySelectorAll('.carousel-navigation-item')
const carouselBulletsContainer = document.querySelector('.carousel-bullets')

function setAnimationsName(oldIndex, newIndex) {
    if (Math.abs(oldIndex - newIndex) > 1) return oldIndex > newIndex ? 'left' : 'right'
    return oldIndex < newIndex ? 'left' : 'right'
}

function setActiveItem(newIndex) {
    // Normalize index to items length
    newIndex = (newIndex % carouselItems.length) >= 0 ?
        newIndex % carouselItems.length :
        carouselItems.length + (newIndex % carouselItems.length)

    // Remove active items, get oldIndex and side to animate
    let oldIndex
    let side_to_animate
    for (let i=0; i < carouselItems.length; i++) {
        if (carouselItems[i].getAttribute('data-status') == 'active') {
            oldIndex = carouselItems[i].getAttribute('data-index') * 1
            side_to_animate = setAnimationsName(oldIndex, newIndex)
            console.log(side_to_animate)
        }

        if (i != newIndex) {
            carouselItems[i].setAttribute('data-status', 'moving')
            carouselBulletsContainer.children[i].setAttribute('data-active', 'false')
        }
    }

    // Set active items
    carouselItems[newIndex].setAttribute('data-status', 'active')
    carouselBulletsContainer.children[newIndex].setAttribute('data-active', 'true')

    // Overwrite animations
    carouselItems[newIndex].setAttribute('data-animation', `from-${side_to_animate}`)
    carouselItems[oldIndex].setAttribute('data-animation', `to-${side_to_animate}`)

}

for (let i=0; i < carouselItems.length; i++) {
    const bullet = document.createElement('div')
    bullet.setAttribute('data-index', i)
    carouselItems[i].getAttribute('data-status') == 'active' ?
        bullet.setAttribute('data-active', 'true') :
        bullet.setAttribute('data-active', 'false')
    bullet.addEventListener('click', e => {
        const itemActiveIndex = e.target.getAttribute('data-index') * 1
        setActiveItem(itemActiveIndex)
    })
    carouselBulletsContainer.appendChild(bullet)
}

carouselNavigators.forEach(navigator => navigator.addEventListener('click', e => {
    const element = e.target.localName !== 'span' ? e.target.parentElement : e.target.parentElement.parentElement

    const itemActiveIndex = [...carouselItems].filter(item => (
        item.getAttribute('data-status') == 'active'
    ))[0].getAttribute('data-index') * 1

    switch (element.getAttribute('aria-label')) {
        case 'carousel-prev':
            setActiveItem(itemActiveIndex - 1)
            break
        case 'carousel-next':
            setActiveItem(itemActiveIndex + 1)
            break
        default:
            break
    }
}))
