export default function(actionCreators, dispatch){
    let boundActionCreators = {}
    for(let key in actionCreators){ //add function add(){return {type:'ADD'}}
        boundActionCreators[key] = function(...args) {
            return dispatch(actionCreators[key](...args))
        }
    }
    return boundActionCreators
}

    //return store.dispatch({type: ActionType.ADD}) 
    //return {type: ActionType.ADD}