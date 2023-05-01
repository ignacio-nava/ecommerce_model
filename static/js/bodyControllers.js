function fixHeight() {
    const header = document.querySelector('header')
    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    const newHeight = window.innerHeight - (header.scrollHeight + footer.scrollHeight)
    main.style.height = `${newHeight}px`
    return
}

document.addEventListener('DOMContentLoaded', e => {
    const body = document.querySelector('body')

    if (window.innerHeight < body.scrollHeight) return

    fixHeight()
    return
})
