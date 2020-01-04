import React from 'react'
import RouterContext from './RouterContext'
import pathToRegexp from 'path-to-regexp'
console.log(pathToRegexp)
/**
 * Route represent one route rule
 * path: rule's path 
 * component: the component need render 
 */
export default class Route extends React.Component {
    static contextType = RouterContext
    render() {
        console.log('jack', this.props)
        let {path='/', component: RouteComponent, exact=false, render, children} = this.props
        path = typeof path==='string' ? path : path.pathname
        let pathname = this.context.location.pathname
        let paramNames = []
        let regexp = pathToRegexp(path, paramNames, { end: exact })
        paramNames = paramNames.map(item => item.name) //["id", "age "]
        let matched = pathname.match(regexp) //['/user/detail/myid/10', 'myid',10]
        let routeProps = {
            location: this.context.location,
            history: this.context.history
        }
        if(matched){
            let [url, ...values] = matched // url='/user/detail/myid/10' values=['myid',10]
            let params=values.reduce((memo, value, index) => {
                memo[paramNames[index]]=value
                return memo
            },{}) //{id: 'myid', age:10}
            let match= {
                url,
                path,
                isExact: pathname===url,
                params
            }
            routeProps.match = match
            if (RouteComponent){
                console.log('rc=', RouteComponent)
                return <RouteComponent {...routeProps} /> 
            } else if(render) {
                return render(routeProps)
            } else if(children) {
                return children(routeProps)
            } else {
                return null
            }
        } else {
            if(children) {
                return children(routeProps)
            } else {
                return null
            }
        }
    }
}

/**
 * a component render through route, it has three properties
 * location
 * history
 * match
 *      url  /user/detail/myid/10
 *      path /user/detail/:id/:age  pathname=/user/detail/1/xx
 *      isExact pathname===url
 *      params: {id:muid, age:10}
 */