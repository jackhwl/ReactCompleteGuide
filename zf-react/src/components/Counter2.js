import React, {useState, useEffect, useContext} from 'react'
import ReactReduxContext from '../react-redux/Context'
import { connect } from '../react-redux'
import * as actions from '../store/actions/counter2'
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
    // let {store} = useContext(ReactReduxContext)
    // let [number, setNumber] = useState(store.getState().counter2.number)
    // useEffect(()=>{
    //     return store.subscribe(()=>{
    //         setNumber(store.getState().counter2.number)
    //     })
    // },[])
    return (
        <div>
            <p>{props.number}</p>
            <button onClick={props.add}>+</button>
            <button onClick={props.minus}>-</button>
        </div>
    )
}

let mapStateToProps = state => state.counter2
//let mapDispatchToProps = actions
export default connect(
    mapStateToProps, actions
)(Counter)