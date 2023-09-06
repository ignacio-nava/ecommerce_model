function fixHeight(setHeight) {
    return
    const main = document.querySelector('main')

    if (!setHeight) {
        main.style.height = null
        return
    }

    const header = document.querySelector('header')
    const footer = document.querySelector('footer')
    const newHeight = window.innerHeight - (header.scrollHeight + footer.scrollHeight)
    main.style.height = `${newHeight}px`
    return
}

function normalizeHeight() {
    const body = document.querySelector('body')
    return fixHeight(window.innerHeight >= body.scrollHeight)
}

document.addEventListener('DOMContentLoaded', normalizeHeight)

window.addEventListener('resize', normalizeHeight)
