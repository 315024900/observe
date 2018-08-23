import htmlToVNode from './htmlToNode';
import Observer from './Observer';

export default class Vue {
  constructor({
    el, template, data = {}, methods = {}, props = {},
  }) {
    const ObData = Observer(Object.assign(data, methods, props));
    if (el) {
      document.querySelector(el).appendChild(htmlToVNode(template, ObData));
    } else {

    }
  }
}
