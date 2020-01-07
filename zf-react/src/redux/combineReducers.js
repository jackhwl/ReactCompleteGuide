export default function combineReducers(reducers){
    // state is combined state={counter1: {number: 0}, counter2: {number: 0}}
    return function(state={}, action){
        let nextState = {}
        for(let key in reducers){
            let reducer = reducers[key]//counter1
            let prevState = state[key]//{number: 0}
            nextState[key] = reducer(prevState, action)
        }
        return nextState
    }
}