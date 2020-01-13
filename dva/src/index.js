import dva, { connect } from 'dva'
import React from 'react'

let app = dva()
app.model({
    namespace: 'counter1',
    state: { number: 0},
    reducers: {
        add(state){
            return { number: state.number + 1}
        },
        minus(state){
            return { number: state.number - 1}
        }
    }
})
app.model({
    namespace: 'counter2',
    state: { number: 0},
    reducers: {
        add(state){
            return { number: state.number + 1}
        },
        minus(state){
            return { number: state.number - 1}
        }
    }
})
ReactDOM.render(<App />, document.getElementById('root'));

