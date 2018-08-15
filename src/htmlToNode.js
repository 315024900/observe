export function htmlToVNode(html, ObData) {
    let h = createVNode
    let span = document.createElement('span')
    span.innerHTML = html
    const createNode = (elment) => {
        return h(elment.tagName.toLowerCase(), {
            style: elment.getAttribute('style'),
            on: getOn(elment, ObData)
        }, [].slice.call(elment.childNodes).map(child => {
            if (child.nodeName === '#text') {
                return child.nodeValue
            }
            return createNode(child)
        }), ObData)
    }
    return createNode(span)
}


function createVNode(tag, {style, on}, children, ObData) {
    let ele = document.createElement(tag)
    if (style) {
        if (/(\{\{)\w+(\}\})/.test(style)) {
            let matche = style.match(/(\{\{)\w+(\}\})/)[0].replace('{{', '').replace('}}', '').trim()
            ObData.$Observer(matche, function () {
                ele.setAttribute('style', style.replace(/(\{\{)\w+(\}\})/g, ObData[matche]))
            })
            ele.setAttribute('style', style.replace(/(\{\{)\w+(\}\})/g, ObData[matche]))
        } else {
            ele.setAttribute('style', style)
        }
    }
    Object.keys(on).forEach(key => {
        ele.addEventListener(key, on[key])
    })
    children.forEach(child => {
        if (typeof child === 'string') {
            let text = document.createTextNode(child)
            if (/\{\{\s*(\w+)\s*\}\}/.test(child)) {

                let matche = child.match(/\{\{\s*(\w+)\s*\}\}/)[1]
                ObData.$Observer(matche, function () {
                    text.nodeValue = child.replace(/\{\{\s*(\w+)\s*\}\}/g, ObData[matche])
                })
                text.nodeValue = child.replace(/\{\{\s*(\w+)\s*\}\}/g, ObData[matche])
            }
            ele.appendChild(text)
        } else if (typeof child === 'object') {
            ele.appendChild(child)
        }
    })
    return ele
}



function getOn(element, ObData) {
    let atts = [...element.attributes]
    let ons = {}
    atts.filter(obj => obj.name[0] === '@').forEach(obj => {
        ons[obj.name.replace('@', '')] = function () {
            new Function(Object.keys(ObData).join(','), obj.value)(...Object.keys(ObData).map(key => ObData[key]));
        }
    })
    return ons
}
