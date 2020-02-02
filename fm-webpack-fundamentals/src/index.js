import nav from './nav'
import { footer } from './footer'
import makeButton from './button'
import { makeColorStyle} from './button-styles'

const button = makeButton("Yay! A Button!")
button.style = makeColorStyle("red")
document.body.appendChild(button)
document.body.appendChild(footer)
// console.log(nav(), top, bottom, 
//     makeButton("My first button!"),
//     makeColorStyle("cyan"))