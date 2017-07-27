class Observer {

    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        const keys = Object.keys(data)
        for (let i = 0, len = keys.length; i < len; i++) {
            this.defineReactive(data, keys[i], data[keys[i]])
        }
    }

    isObject(value) {
        return value != null && typeof value === 'object'
    }

    observe(value) {
        if (!this.isObject(value)) {
            return;
        }
        new Observer(value)
    }
    defineReactive(obj, key,value) {
        this.observe(value)
        var self=this
        const dep = new Dep()

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                if (Dep.target) {
                    dep.depend()
                }
                return value;
            },
            set(newVal){
            	if(newVal===value){
            		return;
            	}
            	value=newVal
            	self.observe(newVal)
            	dep.notify()
            }
        })
    }
}