/**
 * 
 * @param {*} state old state 
 * @param {*} action object with type property
 * return new state
 */
const CHANGE_COLOR = 'CHANGE_COLOR'
let initialState = {color: 'red', updateCount: 0}
function reducer(state = initialState, action) { // {type: CHANGE_COLOR, payload: 'green'}
    if (action.type === CHANGE_COLOR) {
        return { ...state, color: action.payload, updateCount: state.updateCount + 1 }
    }
    return state
}

function createStore(reducer, initialState) {
    let state = initialState
    let listensers = []
    function getState() {
        return state
    }
    function dispatch(action){
        state = reducer(state, action)
        listensers.forEach(listenser => listenser())
    }
    dispatch({type: '@@REDUX_INIT'})
    function subscribe(listenser){
        listensers.push(listenser)
        return function(){
              let index = listensers.indexOf(listenser)
              listensers.splice(index,1)
              //listensers = listensers.filter(item !== listenser)
        }
    }
    return {
        getState,
        dispatch,
        subscribe
    }
}
let store = createStore(reducer, initialState)
console.log(store.getState())
store.subscribe(() => {
     console.log(store.getState())
})
store.dispatch({type: CHANGE_COLOR, payload: 'yellow'})
store.dispatch({type: CHANGE_COLOR, payload: 'green'})
store.dispatch({type: CHANGE_COLOR, payload: 'black'})
//console.log(store.getState())
