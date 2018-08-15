export function Observer(data) {
    let ObEvent = {}

    function $Observer(name, action) {
        if (ObEvent[name]) {
            ObEvent[name].push(action)
        } else {
            ObEvent[name] = [action]
        }
    }

    var obj = new Proxy(data, {
        ...Reflect,
        get: function (target, key, receiver) {
            if (key === '$Observer') {
                return $Observer
            }
            if (typeof target[key] === 'function') {
                return target[key].bind(receiver)
            }

            return Reflect.get(target, key, receiver);
        },
        set: function (target, key, value, receiver) {
            let res = Reflect.set(target, key, value, receiver)
            if (key in ObEvent) {
                ObEvent[key].forEach(action => action())
            }
            return res;
        }
    });
    return obj
}

