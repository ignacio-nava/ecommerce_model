const suggestionsBox = document.getElementById('suggestions')
const suggestionsList = document.getElementById('suggestions-list')
const searchBox = document.getElementById('search')
const navbarSearchForm = document.getElementById('navbar-search-form')


function getActiveSuggestion() {
    return [...suggestionsList.children].filter(children => (
        children.getAttribute('data-active') === 'true'
    ))
}

function setFocusOnSuggestion(sibling) {
    const [active] = getActiveSuggestion()
    if (!active) {
        suggestionsList.firstElementChild.setAttribute('data-active', true)
        suggestionsList.lastElementChild.setAttribute('data-active', false)
        return
    }
    if (!active[sibling]) {
        active.setAttribute('data-active', false)
        return
    }
    active.setAttribute('data-active', false)
    active[sibling].setAttribute('data-active', true)
    return
}

function clearSuggestions() {
    $(suggestionsBox.children[0]).empty()
}

function updateSuggestions(data) {
    clearSuggestions()
    const suggestions = data.suggested_queries
    suggestions.forEach((suggestion, index) => {
        const attributes = {
            class: "pad-x-100 pad-y-050",
            html: suggestion.q
        }
        $('<li/>', attributes)
        .attr({
            "data-value": suggestion.q,
            "data-index": index,
            "data-active": false
        })
        .on("mouseenter", e => {
            [...suggestionsList.children].forEach(children => (
                children === e.target ?
                children.setAttribute('data-active', true) : children.setAttribute('data-active', false)
            ))
        })
        .on("mouseleave", e => e.target.setAttribute('data-active', false))
        .appendTo(suggestionsBox.children[0])
    })
}

function makeQuery(query, limit) {
    const url = 'https://http2.mlstatic.com/resources/sites/MLA/autosuggest?'
    const paramsGET = new URLSearchParams({
        showFilters: true,
        limit: limit,
        api_version: 2,
        q: query
    })

    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(url + paramsGET)
            const data = await res.json()
            resolve(data)
        } catch(err) {
            reject(err)
        }
    })
}

searchBox.addEventListener('keydown', e => (
    (e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.preventDefault()
))


searchBox.addEventListener('keyup', async e => {
    switch(e.key) {
        case 'ArrowUp':
            setFocusOnSuggestion('previousElementSibling')
            break;
        case 'ArrowDown':
            setFocusOnSuggestion('nextElementSibling')
            break;
        default:
            const query = e.target.value.length > 0 ? e.target.value : null

            if (!query) {
                suggestionsBox.setAttribute('aria-hidden', true)
                clearSuggestions()
                return
            }

            suggestionsBox.setAttribute('aria-hidden', false)
            try {
                const data = await makeQuery(query, 5)
                updateSuggestions(data)
            } catch(err) {
                console.log(err)
            }
    }
})

searchBox.addEventListener('focus', e => {
    if (searchBox.value) {
        suggestionsBox.setAttribute('aria-hidden', false)
    }
})

searchBox.addEventListener('focusout', e => {
    navbarSearchForm.dispatchEvent(new Event('submit', {cancelable: true}))
    suggestionsBox.setAttribute('aria-hidden', true)
})

navbarSearchForm.addEventListener('submit', e => {
    e.preventDefault()
    const [active] = getActiveSuggestion()

    if (!active) return

    searchBox.value = active ? active.getAttribute('data-value') : searchBox.value
    navbarSearchForm.submit()
})
