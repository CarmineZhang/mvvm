class Mvvm {
    constructor(options) {
        this.$options = options || {};
        var data = this._data = this.$options.data
        var computedData = this.$options.computed
        var me = this;
        const keys = Object.keys(data)
        let i = keys.length
        while (i--) {
            proxy(me, keys[i])
        }
        this._initComputed(computedData)
            // observe data
        observe(data)
        this.$compile = new Compile(this.$options.el, this)
    }

    _initComputed(computed) {
        var me = this
        if (computed != null && typeof computed === 'object') {
            var keys = Object.keys(computed)
            let i = keys.length
            while (i--) {
                let fn = computed[keys[i]]
                Object.defineProperty(me, keys[i], {
                    get() {
                        return fn.bind(me)()
                    }
                })
            }
        }
    }
}



function proxy(ob, key) {
    Object.defineProperty(ob, key, {
        get() {
            return ob._data[key]
        },
        set(val) {
            ob._data[key] = val
        }
    })
}

function observe(data) {
    new Observer(data)
}