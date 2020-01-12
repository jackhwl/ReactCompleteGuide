1. monitor push method, call history redirect route
use push generate a special action, send to store
routerMiddleware watch this action, redirect to route

2. monitor location route change, store info to reducer
ConnectedRouter

push -> middleware -> history -> historylisten -> store -> components

1. dispatch push
2. in middleware call history.push change route
3. call history.listen() after route changed
4. dispatch({type: 'location_change'})
5. connect-reducer will receive the action save state at store
6. refresh connect store component after state saved
