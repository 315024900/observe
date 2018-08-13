import {htmlToVNode} from "./htmlToNode";
import {Observer} from "./Observer";

export class Vue {
    constructor({el, data}) {
        let ObData = new Observer(data)
        document.body.appendChild(htmlToVNode(el, ObData))
    }
}
