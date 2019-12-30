/**
 * 
 * @param {*} node React node, could be number string ...
 * @param {*} parent  container, a real dom element
 */
function render(node, parent) {
    if (typeof node === 'string') {
        return parent.appendChild(document.createTextNode(node))
    }
    let type, props
    type = node.type //h1 / Function / ClassComponent
    props = node.props
    if (type.isReactComponent) {
        let element = new type(props).render()
        type = element.type
        props = element.props
    }
    if (typeof type === 'function') {
        let element = type(props)
        //console.log('element=', element)
        type = element.type
        props = element.props
    }
    let domElement = document.createElement(type)
    for(let propName in props){
        if (propName === 'children') {
            let children = props.children
            if (!Array.isArray(children)) {
                children = [children]
            }
            children.forEach(child => render(child, domElement))
        } else if (propName === 'className') {
            domElement.className = props.className 
        } else if (propName === 'style') {
            let styleObject = props.style
            for(let attr in styleObject) {
                domElement.style[attr] = styleObject[attr]
            }
        } else {
            domElement.setAttribute(propName, props[propName])
        }
    }
    parent.appendChild(domElement)
}

export default { render }