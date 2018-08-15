import {htmlToVNode} from "./htmlToNode";
import {Observer} from "./Observer";

export class Vue {
    constructor({el, template, data, methods}) {
        let ObData = Observer(Object.assign(data, methods))
        setTimeout(function () {
            ObData.red = '#7ef75d'
        }, 2000)
        document.querySelector(el).appendChild(htmlToVNode(template, ObData))
    }

}
