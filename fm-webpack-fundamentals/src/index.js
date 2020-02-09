import nav from './nav'
//import { footer } from './footer'
const getFooter = () => import('./footer')
import makeButton from './button'
import { makeColorStyle} from './button-styles'
import buttonStyles from './button.css'
import './footer.css'
import makeImage from './image'
import imageUrl from './webpack-logo.jpg'
//import Foo from './foo.ts'

const image = makeImage(imageUrl, 150, 150)
const button = makeButton("Yay! A Button!")
button.style = makeColorStyle("red")

document.body.appendChild(button)

button.addEventListener("click", e => {
    getFooter().then(footerModule => {
        document.body.appendChild(footerModule.footer)
    })
    document.body.appendChild(footer)
})

document.body.appendChild(image)
//  console.log(nav(), top, bottom, 
//      makeButton("My first button!"),
//      makeColorStyle("cyan"))