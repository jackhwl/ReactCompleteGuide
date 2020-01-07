import React, {useState, useEffect} from 'react'
import * as ActionTypes from '../store/actionType'
import store from '../store'

// class Counter extends React.Component {
//     state = { number: store.getState().number }
//     componentDidMount() {
//         this.unSubscribe = store.subscribe(()=>{
//             this.setState({ number: store.getState().number })
//         })
//     }
//     comoponentWillUnmount(){
//         this.unSubscribe()
//     }
//     render(){
//         return (
//             <div>
//                 <p>{this.state.number}</p>
//                 <button onClick={()=>store.dispatch({type: ActionTypes.ADD})}>+</button>
//                 <button onClick={()=>store.dispatch({type: ActionTypes.MINUS})}>-</button>
//             </div>
//         )
//     }
// }

function Counter(props){
    let [number, setNumber] = useState(store.getState().number)
    useEffect(()=>{
        return store.subscribe(()=>{
            setNumber(store.getState().number)
        })
    },[])
    return (
        <div>
            <p>{number}</p>
            <button onClick={()=>store.dispatch({type: ActionTypes.ADD})}>+</button>
            <button onClick={()=>store.dispatch({type: ActionTypes.MINUS})}>-</button>
        </div>
    )
}

export default Counter