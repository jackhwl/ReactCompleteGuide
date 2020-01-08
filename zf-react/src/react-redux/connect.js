import React, {useState, useContext, useEffect} from 'react'
import ReactReduxContext from '../react-redux/Context'
import { bindActionCreators } from '../redux'

export default function(mapStateToProps, mapDispatchToProps){
    return function (OldComponent){
        return function(props){
            const context = useContext(ReactReduxContext)
            let [state, setState] = useState(mapStateToProps(context.store.getState()))
            let [boundActions] = useState(() => bindActionCreators(mapDispatchToProps, context.store.dispatch))
            useEffect(() => {
                return context.store.subscribe(()=>{
                        setState(mapStateToProps(context.store.getState()))
                })
            }, [])
            
            return <OldComponent {...state} {...boundActions} />
        }
    }
}

// let {store} = useContext(ReactReduxContext)
// let [number, setNumber] = useState(props.number)
// useEffect(()=>{
//     return store.subscribe(()=>{
//         setNumber(props.number)
//     })
// },[])