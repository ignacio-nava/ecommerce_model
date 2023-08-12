const images = document.querySelectorAll('.product_image')
images.forEach(image => {
    image.addEventListener('error', e => {
        console.log('not load image')
        e.target.src = '/media/images/default.png'
        e.onerror = null
    })
})
