import React from 'react'
import {Route, Redirect, Link} from '.'
import './NavLink.css'

export default function(props) {
    let {to, exact, children} = props
    //let activeStyle = { backgroundColor: 'green', color: 'red'}
    return (
        <Route 
            path={to}
            children={
                routerProps => <Link className={routerProps.match && (!exact || (exact && routerProps.match.isExact)) ? 'active'  : ''} to={to}>{children}</Link>
            } />
    )
}

// export default function Link(props) {
//     return (
//         <a href={`#${props.to}`}>{props.children}</a>
//     )
// }