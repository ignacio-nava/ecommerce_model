const categoryList = document.querySelector('.category-list')
const categoryListChildren = [...categoryList.children].reverse()

function gridLastChildsCenter() {
    const columnsCount = Number(getComputedStyle(categoryList).getPropertyValue('--columns-count'))
    const modulus = categoryListChildren.length % columnsCount

    for (element of categoryListChildren.slice(0, 5)) {
        element.style.removeProperty('grid-column-end')
    }

    for (let i = 0; i < modulus; i++) {
        const element = categoryListChildren[i]
        element.style.setProperty('grid-column-end', `${-i-2}`)
    }
}
gridLastChildsCenter()
window.addEventListener('resize', gridLastChildsCenter)

categoryListChildren.forEach(item => item.addEventListener('click', e => {
    const element = e.target.localName === 'span' ? e.target.parentElement : e.target
    window.open(element.getAttribute('data-href'))
}))
