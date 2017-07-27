class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else {
            this.getter = parsePath(expOrFn)
        }
        this.cb = cb
        this.deps = []
        this.newDeps = []
        this.depIds = []
        this.newDepIds = []
        this.value = this.get()
    }
    get() {
        pushTarget(this)
        let value
        let vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            throw e
        } finally {
            popTarget()
            this.cleanupDeps()
        }
        return value
    }
    update() {
        this.run()
    }
    run() {
        const value = this.get()
        const oldValue = this.value
        if (value !== oldValue) {
            this.cb.call(this.vm, value, oldValue)
        }
    }
    addDep(dep) {
        const id = dep.id
        if (this.newDepIds.indexOf(id) < 0) {
            this.newDepIds.push(id)
            this.newDeps.push(dep)
            if (this.depIds.indexOf(id) < 0) {
                dep.addSub(this)
            }
        }
    }
    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (this.newDepIds.indexOf(dep.id) < 0) {
                dep.removeSub(this)
            }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.length = 0
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }
}




const bailRE = /[^\w.$]/

function parsePath(path) {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function(obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}