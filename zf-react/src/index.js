import React from 'react'
import ReactDom from 'react-dom'
import Counter from './components/Counter3'
import store from './store'
import {Provider} from 'react-redux'
ReactDom.render(
    <Provider store={store} >
        <Counter />
    </Provider>
    , document.getElementById('root'))
// import { Provider } from 'react-redux'
// import { Route } from 'react-router-dom'
// import Home from './components/Home'
// import Counter0 from './components/Counter0'
// import { ConnectedRouter } from './connected-react-router'
// import store from './store'
// import history from './history'


// ReactDom.render(
//     <Provider store={store} >
//         <ConnectedRouter history={history}>
//             <Route path="/" exact component={Home} />
//             <Route path="/counter" exact component={Counter0} />
//         </ConnectedRouter>
//     </Provider>, document.getElementById('root'))