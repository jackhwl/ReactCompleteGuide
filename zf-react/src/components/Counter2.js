import React, {useState, useEffect, useContext} from 'react'
// import { bindActionCreators } from '../redux'
// import store from '../store'
// import * as actions from '../store/actions/counter2'
import ReactReduxContext from '../react-redux/Context'
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


//let boundActions = bindActionCreators(actions, store.dispatch)
function Counter(props){
    let {store} = useContext(ReactReduxContext)
    let [number, setNumber] = useState(store.getState().counter2.number)
    useEffect(()=>{
        return store.subscribe(()=>{
            setNumber(store.getState().counter2.number)
        })
    },[])
    return (
        <div>
            <p>{number}</p>
            <button onClick={boundActions.add}>+</button>
            <button onClick={boundActions.minus}>-</button>
        </div>
    )
}

export default Counter