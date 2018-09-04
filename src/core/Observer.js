export default function Observer(data) {
  const ObEvent = {};


  function $Observer(name, action) {
    if (ObEvent[name]) {
      ObEvent[name].push(action);
    } else {
      ObEvent[name] = [action];
    }
    return function () {
      const index = ObEvent[name].indexOf(action);
      ObEvent[name].splice(index, 1);
      if (ObEvent[name].length === 0) {
        delete ObEvent[name];
      }
    };
  }

  /**
     * 监控某些参数，让他们会触发某个方法，无论变回参数的值变回多少次，但是这个方法一个周期只会执行一次
     * @param names
     * @param action
     */
  function $ObserverMore(names, action) {
    const cancelActions = [];
    let timeId;
    const lazyAction = () => {
      clearTimeout(timeId);
      timeId = setTimeout(() => {
        action();
      });
    };
    names.forEach((name) => {
      const one = $Observer(name, lazyAction);
      cancelActions.push(one);
    });
  }

  const obj = new Proxy(data, {
    ...Reflect,
    get(target, key, receiver) {
      if (key === '$Observer') {
        return $Observer;
      }
      if (typeof target[key] === 'function') {
        return target[key].bind(receiver);
      }

      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      if (key in ObEvent) {
        ObEvent[key].forEach(action => action());
      }
      return res;
    },
  });
  return obj;
}

