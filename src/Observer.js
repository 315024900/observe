export class Observer {
    constructor(data){
        var obj = new Proxy({}, {
            get: function (target, key, receiver) {
                console.log(`getting ${key}!`);
                return Reflect.get(target, key, receiver);
            },
            set: function (target, key, value, receiver) {
                console.log(`setting ${key}!`);
                return Reflect.set(target, key, value, receiver);
            }
        });
        return obj
    }
}
