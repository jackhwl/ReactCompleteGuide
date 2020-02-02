import { red, blue } from './button-styles'

const top = document.createElement("div")
top.innerText = "Top of Footer"
top.style = red
const bottom = document.createElement("div")
bottom.innerHTML = "Bottom of Footer"
bottom.style = blue

const footer = document.createElement("div")
footer.appendChild(top)
footer.appendChild(bottom)

export {top, bottom, footer}