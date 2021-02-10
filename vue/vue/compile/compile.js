import Watcher from '../core/watch'
/**
 * 遍历dom结构，解析指令和插值表达式
 */
export default class Compile {
  constructor (el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    // 将模板内容移到片段操作
    // 与原来模板隔离
    this.$fragment = this.node2Fragment(this.$el)

    // 编译
    this.compile(this.$fragment)
    this.$el.appendChild(this.$fragment)
  }

  node2Fragment (el) {
    const fragment = document.createDocumentFragment()
    let child;
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }

  compile (el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (node.nodeType === 1) {
        this.compileElement(node)
      } else if (isInter(node)) {
        this.compileText(node)
      }

      // 递归子节点
      if (node.children && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  compileElement (node) {
    const nodeAttrs = node.attributes
    // 遍历所有属性
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name
      const exp = attr.value
      if (attrName.indexOf('v-') === 0) {
        // v-data v-html v-text
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      } else if (attrName.indexOf('@') === 0) {
        const event = attrName.substring(1)
        const method = this.$vm.$options.methods[exp] // method
        this[event + 'Event'] && this[event + 'Event'](node, method)
      }
    })
  }


  // v-text
  text (node, exp) {
    this.update(node, exp, 'text')
  }

  // v-html
  html (node, exp) {
    this.update(node, exp, 'html')
  }

  model (node, exp) {
    // text更新
    this.update(node, exp, 'input')
    node.addEventListener('input', () => {
      this.$vm[exp] = node.value
    })
  }


  // @click
  clickEvent (node, method) {
    node.addEventListener('click', (e) => {
      method.call(this.$vm)
    })
  }

  // text文本替换
  compileText (node) {
    const exp = RegExp.$1
    this.update(node, exp, 'text')
  }

  update (node, exp, dir) {
    const updator = this[dir + 'Updator']
    updator && updator(node, this.$vm[exp])
    // 创建watcher实例， 依赖收集完成
    // val要获取最新的值，不能在外面取（闭包）
    new Watcher(this.$vm, exp, function (val) {
      updator && updator(node, val)
    })
  }

  textUpdator (node, val) {
    node.textContent = val
  }

  inputUpdator (node, val) {
    node.value = val
  }

  htmlUpdator (node, val) {
    node.innerHTML = val
  }
}


function isInter (node) {
  return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
}
