export default function Observer(data) {
  const ObEvent = {};

  function $Observer(name, action) {
    if (ObEvent[name]) {
      ObEvent[name].push(action);
    } else {
      ObEvent[name] = [action];
    }
  }

  const obj = new Proxy(data, {
    ...Reflect,
    get(target, key, receiver) {
      console.log(key);
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

