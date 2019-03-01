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
