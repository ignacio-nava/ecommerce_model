const [columnProducts, columnSummary] = document.querySelectorAll('.basket-column')
const qtySelectors = document.querySelectorAll("#qty-select")
const removeItemButtons = document.querySelectorAll(".button-romeve-item-basket")
const itemsInBasket = document.querySelector(('.in-cart-shopping'))
const summarySubtotal = document.querySelector('#purchase-summary #subtotal')
const shippingMethod = document.querySelector('#id_shipping_method')
const summaryTotal = document.querySelector('#purchase-summary #total')

async function doFetch({url, query}) {
    const res = await fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            "X-CSRFToken": csrfToken,
            "Accept": "application/json",
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(query)
    })

    if (res.ok) return res.json()

    return console.log(res.status, res.statusText)
}

function updateItemsInBasket(qty) {
    itemsInBasket.style.cssText = qty > 0 ? '' : 'display: none'
    itemsInBasket.querySelector('span').innerHTML = `${qty}`
}

function updateSummary({subtotal, total}) {
    if (subtotal) summarySubtotal.querySelector('h2').innerHTML = `$${subtotal}`

    if (total) {
        if (!summaryTotal) return
        return summaryTotal.querySelector('h2').innerHTML = `$${total}`
    }

    const subtotalPrice = Number(
        summarySubtotal
            .querySelector('h2')
            .innerHTML
            .replaceAll('$', '')
    )

    const shippingPrice = shippingMethod ? Number(
        [...shippingMethod.children]
            .filter(child => child.selected)[0]
            .dataset.price
    ) :
    0
    updateSummary({
        total: String(Math.round((subtotalPrice + shippingPrice)*100)/100)
    })

}

// Add event listener to "select" quantity
async function updateListener(e) {
    const data = await doFetch({
        url: urlBasketUpdate,
        query: {
            productId: e.target.dataset.productId,
            productQty: e.target.value
        }
    })

    if (!data) return

    // Update Item Subtotal
    e.target
        .parentElement
        .parentElement
        .nextElementSibling
        .querySelector('p')
        .innerHTML = `$${data.totalItemPrice}`

    // Update Items Count
    updateItemsInBasket(data.basketQty)

    // Update Summary
    updateSummary({
        subtotal: Number(data.totalPrice)
    })
}
qtySelectors.forEach(qtySelector => (
    qtySelector.addEventListener("change", updateListener)
))

function makeElementProduct(frame) {
    const element = document.createElement(frame.element)

    if (frame.id) element.id = frame.id

    frame.classList && frame.classList.forEach(classItem => (
        element.classList.add(classItem)
    ))

    frame.dataset && Object.keys(frame.dataset).forEach(data => (
        element.dataset[data] = frame.dataset[data]
    ))

    frame.attrs && Object.keys(frame.attrs).forEach(attr => (
        element[attr] = frame.attrs[attr]
    ))

    frame.childrens && frame.childrens.forEach(children => (
        element.appendChild(makeElementProduct(children))
    ))

    return element
}

// Add event listener to remove item button
async function deleteListener(e) {
    e.preventDefault()
    const data = await doFetch({
        url: urlBasketDelete,
        query: {
            productId: e.target.value
        }
    })

    if (!data) return

    // Remove old products
    for (let i = columnProducts.children.length-1; i > 0; i--) {
        const children = columnProducts.children[i]
        columnProducts.removeChild(children)
    }

    // Append new products
    for (let i = 0; i < data.items.length; i++) {
        const newRow = makeElementProduct(productRow)
        const newItem = data.items[i]

        // Item
        const imgProduct = newRow.querySelector('img')
        imgProduct.src = newItem.product.image_external ?
            newItem.product.image_external : newItem.product.image
        const title = newRow.querySelector("[data-column='item'] p")
        title.innerHTML = newItem.product.title ?
            newItem.product.title : ''

        // Price
        const price = newRow.querySelector("[data-column='price'] p")
        price.innerHTML = newItem.product.price ?
            `$${newItem.product.price}` : ''

        // Quantity
        const select = newRow.querySelector("#qty-select")
        select.dataset.productId = newItem.product.id
        select.addEventListener("change", updateListener)
        const stockLimit = newItem.totalItemQty < 4 ? 4 : newItem.totalItemQty

        for (let j = 1; j <= stockLimit; j++) {
            const option = document.createElement('option')
            option.value = j
            option.innerHTML = j
            option.selected = newItem.totalItemQty == j
            select.appendChild(option)
        }

        // Subtotal
        const subtotal = newRow.querySelector("[data-column='subtotal'] p")
        subtotal.innerHTML = `$${newItem.totalItemPrice}`

        const removeButton = newRow.querySelector("[data-column='subtotal'] button")
        removeButton.value = newItem.product.id
        removeButton.addEventListener('click', deleteListener)

        columnProducts.appendChild(newRow)
    }

    fixHeight(true)

    // Update Items Count
    updateItemsInBasket(data.qty)

    // Update Summary
    updateSummary({
        subtotal: String(data.totalPrice)
    })
}
removeItemButtons.forEach(removeItemButton => (
    removeItemButton.addEventListener("click", deleteListener)
))

// Shipping Methods Update
shippingMethod && shippingMethod.addEventListener('change', e => {
    const subtotalPrice = Number(
        summarySubtotal
            .querySelector('h2')
            .innerHTML
            .replaceAll('$', '')
    )
    const shippingPrice = Number(
        [...e.target.children]
            .filter(child => child.selected)[0]
            .dataset.price
    )
    updateSummary({
        total: String(Math.round((subtotalPrice + shippingPrice)*100)/100)
    })
})

