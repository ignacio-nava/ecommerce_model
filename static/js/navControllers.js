// const primaryNavigation = document.querySelector(".primary-navigation")
const navigationToggle = document.querySelector(".navigation-toggle-button")
navigationToggle.addEventListener("click", e => {
    e.preventDefault()
    // primaryNavigation.toggleAttribute("data-visible")
    navigationToggle.children[0].toggleAttribute("data-active")
})

const userOptionsToggle = document.querySelector('#user-options-toggle')
const userOptions = document.querySelector('#user-options')
userOptionsToggle && userOptionsToggle.addEventListener('click', e => {
    e.preventDefault()
    userOptionsToggle.toggleAttribute("data-active")
    userOptions.toggleAttribute("data-active")
})
