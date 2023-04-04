import { navigationOptions } from "./navigationsOptions.js"
import { bulletsOptions } from './bulletsOptions.js'

export class Carousel {

    constructor(selector) {
        this.carousel = document.querySelector(selector)
        this.carousel.classList.add('carousel')
        this.carouselItemsDiv = this.carousel.children[0]
        this.carouselItems = this.carouselItemsDiv.children
    }

    build(config={}) {
        this.config = {
            type: config.type || 'classic'
        }
        this.config = {
            ...this.config,
            initalIndexActive: config.initalIndexActive || 0,
            navigators: this._checkData(config.navigators, this.config.type),
            bullets: this._checkData(config.bullets, this.config.type)
        }

        switch (this.config.type) {
            case 'classic':
                this.carouselItemsDiv.classList.add('carousel-classic')
                this._buildIndex()
                this._setActiveItem(this.config.initalIndexActive, true)
                if (this.config.navigators) {
                    this._buildElement(navigationOptions[this.config.navigators])
                }
                if (this.config.bullets) {
                    this._buildElement(bulletsOptions[this.config.bullets])
                }

                ['mouseenter', 'mouseleave'].forEach(listener => (
                   this.carouselItemsDiv.addEventListener(listener, e => (
                    this._setNavigationHoverAnimation(e)
                   ))
                ))
                break

            case 'slide':
                this.carouselItemsDiv.classList.add('carousel-slide')
                const itemsCopy = [...this.carouselItems]
                for (let i = 0; i < itemsCopy.length; i++) {
                    const item = itemsCopy[i]
                    this.carouselItemsDiv.removeChild(item)
                }

                this.slider = document.createElement('div')
                this.slider.classList.add('flex-row')
                for (let i = 0; i < itemsCopy.length; i++) {
                    const item = itemsCopy[i]
                    item.classList.add('test-box')
                    item.setAttribute('data-index', i)
                    this.slider.appendChild(item)
                }
                this.carouselItemsDiv.appendChild(this.slider)
                this.carouselItems = this.carouselItems[0].children

                if (this.config.navigators) {
                    this._buildElement(navigationOptions[this.config.navigators])
                }

                ['mouseenter', 'mouseleave'].forEach(listener => (
                    this.carouselItemsDiv.addEventListener(listener, e => (
                     this._setNavigationHoverAnimation(e, navigators => (
                        this.slider.addEventListener('scrollend', e => {
                            if (e.target.scrollLeft == 0) {
                                navigators.forEach(navigator => {
                                    switch (navigator.getAttribute('aria-label')) {
                                        case 'carousel-prev':
                                            navigator.style.setProperty('display', 'none')
                                            break
                                        case 'carousel-next':
                                            navigator.style.setProperty('display', 'block')
                                            break
                                        default:
                                            break
                                    }
                                })
                            } else if (e.target.scrollLeft == e.target.scrollLeftMax) {
                                navigators.forEach(navigator => {
                                    switch (navigator.getAttribute('aria-label')) {
                                        case 'carousel-prev':
                                            navigator.style.setProperty('display', 'block')
                                            break
                                        case 'carousel-next':
                                            navigator.style.setProperty('display', 'none')
                                            break
                                        default:
                                            break
                                    }
                                })
                            } else {
                                navigators.forEach(navigator => navigator.style.setProperty('display', 'block'))
                            }
                        })
                     ))
                    ))
                ))
                break

            default:
                break
        }
    }


    _checkData(inputData, defaultObject) {
        switch (inputData) {
            case undefined:
                return defaultObject
            case false:
                return false
            default:
                if (!this[inputData]) return defaultObject
                return inputData
        }
    }

    _buildIndex() {
        for (let i = 0; i < this.carouselItems.length; i++) {
            const item = this.carouselItems[i]
            item.classList.add('carousel-item')
            item.setAttribute('data-index', i)
        }

    }

    _buildElement(obj, parent=this.carousel) {

        const element = document.createElement(obj.element)
        obj.classes && obj.classes.forEach(c => (
            element.classList.add(c)
        ))

        obj.styles && obj.styles.forEach(s => (
            element.style.setProperty(s.name, s.value)
        ))

        obj.attibutes && obj.attibutes.forEach(attr => (
            element.setAttribute(attr.name, attr.value)
        ))

        if (obj.eventListeners) {
            for (let i = 0; i < obj.eventListeners.length; i++) {
                const {event, callback} = obj.eventListeners[i]
                element.addEventListener(event, e => this[callback](e))
            }
        }

        if (obj.innerHTML) element.innerHTML = obj.innerHTML

        obj.childrens && obj.childrens.forEach(children => (
            this._buildElement(children, element)
        ))

        obj.callback && obj.callback(this, element)

        if (obj.setter) this[obj.setter] = element

        parent.appendChild(element)
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
                side_to_animate = this._setAnimationsName(oldIndex, newIndex)
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

    _navigatorClickListenerClassic(e) {
        const element = this._getNavigationRuler(e)

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

    _navigatorClickListenerSlide(e) {
        const element = this._getNavigationRuler(e)

        const maxScroll = this.slider.scrollLeftMax
        const unit = (maxScroll / (this.slider.childElementCount - 4)) * 4

        switch (element.getAttribute('aria-label')) {
            case 'carousel-prev':
                this.slider.scrollLeft -= unit
                break
            case 'carousel-next':
                this.slider.scrollLeft += unit
                break
            default:
                break
        }
    }

    _setAnimationsName(oldIndex, newIndex) {
        if (Math.abs(oldIndex - newIndex) > 1) return oldIndex > newIndex ? 'left' : 'right'
        return oldIndex < newIndex ? 'left' : 'right'
    }

    _setNavigationHoverAnimation(e, callback) {
        const navigators = this.carouselItemsDiv.parentElement.querySelectorAll('.carousel-navigation-item')

        if (callback) callback(navigators)

        switch (e.type) {
            case 'mouseenter':
                for (let navigator of navigators) {
                    navigator.setAttribute('data-visible', 'true')
                }
                break
            case 'mouseleave':
                    for (let navigator of navigators) {
                        navigator.removeAttribute('data-visible')
                    }
            default:
                break
        }
    }

    _getNavigationRuler(e) {
        return e.target.localName === 'span' ? e.target.parentElement.parentElement : e.target.parentElement
    }
}
