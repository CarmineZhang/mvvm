class Mvvm {
    constructor(options) {
        this.$options = options || {};
        var data = this._data = this.$options.data;
        var me = this;
        const keys = Object.keys(data)
        let i = keys.length
        while (i--) {
            proxy(me, keys[i])
        }
        // observe data
        observe(data)
        this.$compile=new Compile(this.$options.el,this)
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

function observe(data){
	new Observer(data)
}