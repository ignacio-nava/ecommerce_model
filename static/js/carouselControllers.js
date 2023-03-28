function setAnimationsName(oldIndex, newIndex) {
    if (Math.abs(oldIndex - newIndex) > 1) return oldIndex > newIndex ? 'left' : 'right'
    return oldIndex < newIndex ? 'left' : 'right'
}

class Carousel {
    constructor(selector, config={}) {
        this.carousel = document.querySelector(selector)
        this.carouselItemsDiv = this.carousel.querySelector('.carousel-container')
        this.config = {
            type: config.type || 'classic',
            bullets: config.bullets || true,
            navigators: config.navigators || true,
            initalIndexActive: config.initalIndexActive || 0
        }
    }

    build() {
        switch (this.config.type) {
            case 'classic':
                this._buildIndex()
                this._setActiveItem(this.config.initalIndexActive, true)
                this._buildNavigators()
                this._buildBullets()
                break
            default:
                break
        }
    }

    _buildIndex() {
        for (let i = 0; i < this.carouselItemsDiv.children.length; i++) {
            const item = this.carouselItemsDiv.children[i]
            item.classList.add('carousel-item')
            item.setAttribute('data-index', i)
        }
        this.carouselItems = this.carousel.querySelectorAll('.carousel-item')
    }

    _setActiveItem(newIndex, initial=false) {
        // Normalize index to items length
        newIndex = (newIndex % this.carouselItems.length) >= 0 ?
            newIndex % this.carouselItems.length :
            this.carouselItems.length + (newIndex % this.carouselItems.length)

        // Remove active items, get oldIndex and side to animate
        let oldIndex;
        let side_to_animate;
        for (let i=0; i < this.carouselItems.length; i++) {
            if (this.carouselItems[i].getAttribute('data-status') == 'active') {
                oldIndex = this.carouselItems[i].getAttribute('data-index') * 1
                side_to_animate = setAnimationsName(oldIndex, newIndex)
            }

            if (i != newIndex) {
                this.carouselItems[i].setAttribute('data-status', 'moving')
                this.divBullets && this.divBullets.children[i].setAttribute('data-active', 'false')
            }
        }

        // Set active items
        this.carouselItems[newIndex].setAttribute('data-status', 'active')
        this.divBullets && this.divBullets.children[newIndex].setAttribute('data-active', 'true')

        // Overwrite animations
        this.carouselItems[newIndex].setAttribute('data-animation', `from-${side_to_animate}`)
        !initial && this.carouselItems[oldIndex].setAttribute('data-animation', `to-${side_to_animate}`)
    }

    _buildNavigators() {
        if (!this.config.navigators) return

        const divNavigators = document.createElement('div')
        divNavigators.classList.add('carousel-navigation')

        const divNavLeft = document.createElement('div')
        divNavLeft.classList.add('carousel-navigation-item')
        divNavLeft.classList.add('carousel-left')
        divNavLeft.style.setProperty('--side-shadow', '-1')
        divNavLeft.setAttribute('aria-label', 'carousel-prev')
        const spanLeftArrow = document.createElement('div').appendChild(document.createElement('span'))
        spanLeftArrow.classList.add('carousel-navigation-arrow')
        spanLeftArrow.style.setProperty('--right-position', '12px')
        spanLeftArrow.innerHTML = '&lt'
        divNavLeft.appendChild(spanLeftArrow)

        const divNavRight = document.createElement('div')
        divNavRight.classList.add('carousel-navigation-item')
        divNavRight.classList.add('carousel-right')
        divNavRight.setAttribute('aria-label', 'carousel-next')
        const spanRightArrow = document.createElement('div').appendChild(document.createElement('span'))
        spanRightArrow.classList.add('carousel-navigation-arrow')
        spanRightArrow.style.setProperty('--left-position', '12px')
        spanRightArrow.innerHTML = '&gt'
        divNavRight.appendChild(spanRightArrow)

        divNavLeft.addEventListener('click', e => this._navigatorClickListener(e))
        divNavRight.addEventListener('click', e => this._navigatorClickListener(e))

        divNavigators.appendChild(divNavLeft)
        divNavigators.appendChild(divNavRight)


        this.carousel.appendChild(divNavigators)

    }

    _buildBullets() {
        if (!this.config.bullets) return

        this.divBullets = document.createElement('div')
        this.divBullets.classList.add('carousel-bullets')

        for (let i=0; i < this.carouselItems.length; i++) {
            const bullet = document.createElement('div')
            bullet.setAttribute('data-index', i)
            this.carouselItems[i].getAttribute('data-status') == 'active' ?
                bullet.setAttribute('data-active', 'true') :
                bullet.setAttribute('data-active', 'false')
            bullet.addEventListener('click', e => {
                const itemActiveIndex = e.target.getAttribute('data-index') * 1
                this._setActiveItem(itemActiveIndex)
            })
            this.divBullets.appendChild(bullet)
        }

        this.carousel.appendChild(this.divBullets)
    }

    _navigatorClickListener(e) {
        const element = e.target.localName === 'span' ? e.target.parentElement : e.target

        const itemActiveIndex = [...this.carouselItems].filter(item => (
            item.getAttribute('data-status') == 'active'
        ))[0].getAttribute('data-index') * 1

        switch (element.getAttribute('aria-label')) {
            case 'carousel-prev':
                this._setActiveItem(itemActiveIndex - 1)
                break
            case 'carousel-next':
                this._setActiveItem(itemActiveIndex + 1)
                break
            default:
                break
        }

    }
}


