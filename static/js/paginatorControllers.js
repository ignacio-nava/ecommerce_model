const paginatorItems = document.querySelectorAll('.paginator__item-container')
paginatorItems.forEach(item => item.addEventListener('click', e => {
    window.location = e.target.querySelector('a').href
}))
