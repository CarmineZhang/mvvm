class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        if (this.$el) {
            this.$fragment = this.createFragment(this.$el)
            this.init()
            this.$el.appendChild(this.$fragment)
        }
    }
    createFragment(el) {
        var fragment = document.createDocumentFragment(),
            child
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    }
    init() {
        this.compileElement(this.$fragment)
    }
    compileElement(el) {
        var childNodes = el.childNodes,
            me = this
        const nodes = [].slice.call(childNodes)
        nodes.forEach((node) => {
            var text = node.textContent
            var reg = /\{\{(.*)\}\}/
            if (this.isElementNode(node)) {
                this.compile(node)
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, RegExp.$1)
            }
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node)
            }
        })
    }
    compile(node) {
        var attrs = node.attributes;
        [].slice.call(attrs).forEach((attr) => {
            var attrName = attr.name
            if (this.isDirective(attrName)) {
                var exp = attr.value
                var dir = attrName.substring(1)
                if (dir === 'model') {
                    compileUtil[dir] && compileUtil[dir](node, this.$vm, exp, dir)
                    compileUtil.eventModelHandler(node, this.$vm, exp)
                } else {
                    compileUtil[dir] && compileUtil[dir](node, this.$vm, exp, dir)
                }
                node.removeAttribute(attrName)
            } else if (this.isEvent(attrName)) {
                var exp = attr.value
                var dir = attrName.substring(1)
                compileUtil.eventHandler(node, this.$vm, exp, dir)
                node.removeAttribute(attrName)
            }
            
        })
    }
    compileText(node, exp) {
        compileUtil['text'](node, this.$vm, exp)
    }

    isDirective(attr) {
        return attr.indexOf(':') === 0
    }
    isEvent(attr) {
        return attr.indexOf('@') === 0
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
}

var compileUtil = {
    text(node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    model(node,vm, exp) {
        this.bind(node, vm, exp, 'value')
    },
    bind(node, vm, exp, pre) {
        var fn = helper[pre + 'Updater']
        fn && fn(node, this._getVMVal(vm, exp))
        new Watcher(vm, exp, (newVal, oldVal) => {
            fn && fn(node, newVal)
        })
    },
    eventModelHandler(node, vm, exp) {
        var fn = function(e) {
           this[exp] = e.target.value
        }
        node.addEventListener('input', fn.bind(vm), false);
    },
    eventHandler(node, vm, exp, dir) {
        var eventType = dir
        fn = vm.$options.methods[exp]
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
    _getVMVal(vm, exp) {
        var val = vm
        exp = exp.split('.')
        exp.forEach(function(k) {
            val = val[k]
        });
        return val
    }
}

var helper = {
    textUpdater(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },
    valueUpdater(node, value) {
        node.value = typeof value === 'undefined' ? '' : value
    }
}