create-react-app burger

#ReactCompleteGuide

person.js
const person = {
    name: 'Max'
}

export default person

# default export
import person from './person.js'
import prs from './person.js'

utility.js
export const clean = () => {...}
export const baseData = 10;

# named export
import { baseData as bd, clean } from './utility.js'
import * as bundled from './utility.js'
