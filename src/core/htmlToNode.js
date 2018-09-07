function expandValue({ value, addPreString = '$ObData', ObData = {} } = {}) {
  const keys = [];
  if (!value) {
    return value;
  }
  const theValue = value.replace(/(\s|^|\(|\+|-)([A-Za-z0-9_$$]+)/g, (key) => {
    const theKey = key.match(/([A-Za-z0-9_$$]+)/)[0];
    console.log(theKey, key, 323, ObData);

    if (ObData[theKey]) {
      keys.push(theKey);
      return `${addPreString}.${theKey}`;
    }
    return key;
  });
  console.log(theValue,111)
  return {
    keys,
    result: `return ( ${theValue} )`,
  };
}

/**
 * 监控某些参数，让他们会触发某个方法，无论变回参数的值变回多少次，但是这个方法一个周期只会执行一次
 * @param names
 * @param action
 * @param ObData
 */

function observerMore(names, action, ObData, immediate) {
  const cancelActions = [];
  let timeId;
  const lazyAction = () => {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      action();
    });
  };
  if (immediate) {
    lazyAction();
  }
  names.forEach((name) => {
    const one = ObData.$Observer(name, lazyAction);
    cancelActions.push(one);
  });
}

function createVNode(tag, { on, attrs }, children, ObData) {
  const ele = document.createElement(tag);
  attrs.forEach((obj) => {
    if (!(/^:/.test(obj.name))) {
      ele.setAttribute(obj.name, obj.value);
      return;
    }
    if (obj.value !== 0 && !obj.value) {
      return;
    }
    const { keys, result } = expandValue({ value: obj.value, ObData });
    /* eslint-disable-next-line no-new-func */
    const meth = new Function('$ObData', result);
    observerMore(keys, () => ele.setAttribute(obj.name, meth(ObData)), ObData, true);
  });

  Object.keys(on).forEach((key) => {
    ele.addEventListener(key, on[key]);
  });
  children.forEach((child) => {
    if (typeof child === 'string') {
      const text = document.createTextNode(child);
      if (/\{\{(.*)\}\}/.test(child)) {
        const matche = child.match(/\{\{(.*)\}\}/)[1];
        const { keys, result } = expandValue({ value: matche, ObData });
        /* eslint-disable-next-line no-new-func */
        const meth = new Function('$ObData', result);
        observerMore(keys, () => {
          text.nodeValue = meth(ObData);
        }, ObData, true);
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
    const theValue = expandValue({ value: obj.value, ObData }).result;
    /* eslint-disable-next-line no-new-func */
    const meth = new Function('$event,$ObData', theValue);
    ons[obj.name.replace('@', '')] = function (e) {
      const $event = {};
      ['type', 'target'].forEach((key) => {
        $event[key] = e[key];
      });
      meth($event, ObData);
    };
  });
  return ons;
}

function htmlToVNode(html, ObData) {
  const h = createVNode;
  const span = document.createElement('span');
  span.innerHTML = html;
  const createNode = elment => h(
    elment.tagName.toLowerCase(),
    {
      // 正常的 HTML 特性
      attrs: Array.from(elment.attributes).filter(obj => !(/^@/.test(obj.name))).map(obj => ({
        name: obj.name,
        value: obj.vulue,
      })),
      on: getOn(elment, ObData),
    }, [].slice.call(elment.childNodes).map((child) => {
      if (child.nodeName === '#text') {
        return child.nodeValue;
      }
      return createNode(child);
    }), ObData,
  );
  return createNode(span.firstElementChild);
}


export default htmlToVNode;
