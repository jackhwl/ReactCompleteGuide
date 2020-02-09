import nav from './nav'
//import * as GSAP from 'gsap'
const getGSAP = () => import('gsap')
//import { footer } from './footer'
const getFooter = () => import('./footer')
import makeButton from './button'
import { makeColorStyle} from './button-styles'
import buttonStyles from './button.css'
import './footer.css'
import makeImage from './image'
import imageUrl from './webpack-logo.jpg'
//import Foo from './foo.ts'

const setButtonStyle = (color) => import(`./button-styles/${color}`)
const image = makeImage(imageUrl, 150, 150)
const button = makeButton("Yay! A Button!")
button.style = makeColorStyle("red")

document.body.appendChild(button)

button.addEventListener("click", e => {
    getFooter().then(footerModule => {
        document.body.appendChild(footerModule.footer)
    })

    getGSAP().then(gsap => {
        console.log(gsap)
    })

    setButtonStyle("blue").then(styleStr => {
        console.log(styleStr)
        button.style = styleStr.default
    })
})

document.body.appendChild(image)
//  console.log(nav(), top, bottom, 
//      makeButton("My first button!"),
//      makeColorStyle("cyan"))