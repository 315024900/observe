function createVNode(tag, {style}, children,ObData) {
    let ele = document.createElement(tag)
    if (style) {
        ele.setAttribute('style', style)
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            let text=document.createTextNode(child)
            ele.appendChild(text)
        } else if (typeof child === 'object') {
            ele.appendChild(child)
        }
    })
    return ele
}

export function htmlToVNode(html,ObData) {
    let h = createVNode
    let span = document.createElement('span')
    span.innerHTML = html
    const createNode = (elment) => {
        return h(elment.tagName.toLowerCase(), {style: elment.getAttribute('style')}, [].slice.call(elment.childNodes).map(child => {
            if (child.nodeName === '#text') {
                return child.nodeValue
            }
            return createNode(child)
        }),ObData)
    }
    return createNode(span)
}
