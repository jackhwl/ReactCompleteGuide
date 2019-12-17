import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import BurgerBuilder from './BurgerBuilder'

configure({adapter: new Adapter()})

describe('<BurgerBuilder />', () => {
    let wrapper

    beforeEach(() => {
        //wrapper = shallow(<BurgerBuilder onInitIngredients={()=>{}} />)
    })

    it('should render <BurgerControls /> when receiving ingredients', () => {
        //wrapper.setProps({ingredients: {salad: 0}})
        //expect(wrapper.find(BurgerControls)).toHaveLength(1)
    })
})