import htmlToVNode from './htmlToNode';
import Observer from './Observer';

export default class Vue {
  constructor({
    el, template, data, methods,
  }) {
    const ObData = Observer(Object.assign(data, methods));
    document.querySelector(el).appendChild(htmlToVNode(template, ObData));
  }
}
