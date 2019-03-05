/**
 * 创建dom函数，类似vue的虚拟dom函数
 * @param tag 标签名 例如  div
 * @param style 样式的style
 * @param on 事件
 * @param children 子元素
 * @param ObData 注册了监听Observe的数据
 * @returns {HTMLElement} 返回生成的dom
 */
function createVNode(tag, { style, on }, children, ObData) {
  const ele = document.createElement(tag);
  if (style) {
    if (/(\{\{)\w+(\}\})/.test(style)) {
      const matche = style.match(/(\{\{)\w+(\}\})/)[0].replace('{{', '').replace('}}', '').trim();
      ObData.$Observer(matche, () => {
        ele.setAttribute('style', style.replace(/(\{\{)\w+(\}\})/g, ObData[matche]));
      });
      ele.setAttribute('style', style.replace(/(\{\{)\w+(\}\})/g, ObData[matche]));
    } else {
      ele.setAttribute('style', style);
    }
  }
  Object.keys(on).forEach((key) => {
    ele.addEventListener(key, on[key]);
  });
  children.forEach((child) => {
    if (typeof child === 'string') {
      const text = document.createTextNode(child);
      if (/\{\{\s*(\w+)\s*\}\}/.test(child)) {
        const matche = child.match(/\{\{\s*(\w+)\s*\}\}/)[1];
        ObData.$Observer(matche, () => {
          text.nodeValue = child.replace(/\{\{\s*(\w+)\s*\}\}/g, ObData[matche]);
        });
        text.nodeValue = child.replace(/\{\{\s*(\w+)\s*\}\}/g, ObData[matche]);
      }
      ele.appendChild(text);
    } else if (typeof child === 'object') {
      ele.appendChild(child);
    }
  });
  return ele;
}

/**
 * 解析DOM上面的事件
 * @param element 传入的DOM
 * @param ObData 要绑定到，哪部分的监听数据
 */
function getOn(element, ObData) {
  const atts = [...element.attributes];
  const ons = {};
  atts.filter(obj => obj.name[0] === '@').forEach((obj) => {
    /* eslint-disable-next-line */
    ons[obj.name.replace('@', '')] = function () {
      /* eslint-disable-next-line no-new-func */
      new Function(Object.keys(ObData).join(','), obj.value)(...Object.keys(ObData).map(key => ObData[key]));
    };
  });
  return ons;
}


/**
 * 将html解析成DOM
 * @param html 模板
 * @param ObData  注册了监听Observe的数据
 * @returns {HTMLElement} 返回DOM
 */
function htmlToVNode(html, ObData) {
  const h = createVNode;
  const span = document.createElement('span');
  span.innerHTML = html;
  const createNode = elment => h(elment.tagName.toLowerCase(), {
    style: elment.getAttribute('style'),
    on: getOn(elment, ObData),
  }, [].slice.call(elment.childNodes).map((child) => {
    if (child.nodeName === '#text') {
      return child.nodeValue;
    }
    return createNode(child);
  }), ObData);
  return createNode(span);
}

export default htmlToVNode;
