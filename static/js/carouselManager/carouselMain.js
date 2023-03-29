import { classicNavigatorArrow } from "./navigationsOptions.js"
import { classicBulletCircle } from './bulletsOptions.js'

export class Carousel {
    classicNavigatorArrow = classicNavigatorArrow
    classicBulletCircle = classicBulletCircle

    constructor(selector, config={}) {
        this.carousel = document.querySelector(selector)
        this.carouselItemsDiv = this.carousel.querySelector('.carousel-container')
        this.config = {
            type: this._checkData(config.type, 'classic'),
            initalIndexActive: config.initalIndexActive || 0,
            navigators: this._checkData(config.navigators, 'classicNavigatorArrow'),
            bullets: this._checkData(config.bullets, 'classicBulletCircle')
        }
    }

    build() {
        switch (this.config.type) {
            case 'classic':
                this._buildIndex()
                this._setActiveItem(this.config.initalIndexActive, true)
                if (this.config.navigators) {
                    this._buildElement(this[this.config.navigators])
                }
                if (this.config.bullets) {
                    this._buildElement(this[this.config.bullets])
                }
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
        for (let i = 0; i < this.carouselItemsDiv.children.length; i++) {
            const item = this.carouselItemsDiv.children[i]
            item.classList.add('carousel-item')
            item.setAttribute('data-index', i)
        }
        this.carouselItems = this.carousel.querySelectorAll('.carousel-item')
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

    _navigatorClickListener(e) {
        const element = e.target.localName === 'span' ? e.target.parentElement.parentElement : e.target.parentElement

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

    _setAnimationsName(oldIndex, newIndex) {
        if (Math.abs(oldIndex - newIndex) > 1) return oldIndex > newIndex ? 'left' : 'right'
        return oldIndex < newIndex ? 'left' : 'right'
    }
}
