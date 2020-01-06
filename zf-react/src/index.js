import { createStore } from './redux'
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
let initialState = { number: 0}
function reducer(state = initialState, action){
    switch (action.type) {
        case INCREMENT:
            return { number: state.number + 1}
        case DECREMENT:
            return { number: state.number - 1}
        default:
            return state
    }
}
let store = createStore(reducer)
let root = document.getElementById('root')
let incrementBtn = document.getElementById('increment-btn')
let decrementBtn = document.getElementById('decrement-btn')
console.log(store)
const render = () => {
    root.innerHTML = store.getState().number
}
render()
store.subscribe(render)

incrementBtn.addEventListener('click', ()=>{
    store.dispatch({type: INCREMENT})
})
decrementBtn.addEventListener('click', ()=>{
    store.dispatch({type: DECREMENT})
})

// /**
//  * 
//  * @param {*} state old state 
//  * @param {*} action object with type property
//  * return new state
//  */
// const CHANGE_COLOR = 'CHANGE_COLOR'
// let initialState = {color: 'red', updateCount: 0}
// function reducer(state = initialState, action) { // {type: CHANGE_COLOR, payload: 'green'}
//     if (action.type === CHANGE_COLOR) {
//         return { ...state, color: action.payload, updateCount: state.updateCount + 1 }
//     }
//     return state
// }

// let store = createStore(reducer, initialState)
// console.log(store.getState())
// store.subscribe(() => {
//      console.log(store.getState())
// })
// store.dispatch({type: CHANGE_COLOR, payload: 'yellow'})
// store.dispatch({type: CHANGE_COLOR, payload: 'green'})
// store.dispatch({type: CHANGE_COLOR, payload: 'black'})
// console.log(store.getState())
