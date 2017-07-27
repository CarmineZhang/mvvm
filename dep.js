let uid = 0
class Dep {
    constructor() {
        this.id = uid++;
        this.subs = []
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    removeSub(sub) {
        remove(this.subs, sub)
    }
    notify() {
        const subs = this.subs.slice(0)
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

function remove(arr, item) {
    var index = arr.indexOf(item)
    if (index > -1) {
        return arr.splice(index, 1)
    }
}

Dep.target = null
const targetStack = []

function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

function popTarget() {
    Dep.target = targetStack.pop()
}