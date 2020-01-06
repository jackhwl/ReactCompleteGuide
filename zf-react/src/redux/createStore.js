export default function createStore(reducer, initialState) {
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