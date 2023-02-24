function hiddenMessage(e) {
    const element = e.target.localName !== 'span' ? e.target : e.target.parentElement
    element.style.display = 'none'
}

function showMessage(message, tags = 'success') {
    const htmlData = `<span>${message}</span>`
    const attributes = {
        id: "flash-message",
        class: "message message-show",
        html: htmlData
    }
    $('<div/>', attributes)
    .attr('tags', tags)
    .on('click', e => {
        hiddenMessage(e)
    })
    .appendTo('#main-content')
}

function setMessageHandler() {
    const messages = document.querySelectorAll('#flash-message')
    messages.forEach(message => {
        message.addEventListener('click', e => {
            hiddenMessage(e)
        })
    })
}
