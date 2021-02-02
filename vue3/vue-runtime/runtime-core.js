const {
  reactive: _reactive,
  computed: _computed,
  effect: _effect
} = window.rectivity

const renderer = createRenderer({
  // 搜索元素
  querySelector (sel) {
    return document.querySelector(sel)
  },
  // 创建元素
  createElement (tag) {
    return document.createElement(tag)
  },
  // 插入
  insert (child, parent) {
    parent.appendChild(child)
  }
})

function createRenderer (options) {
  // 创建render函数
  const {
    querySelector: hostQuerySelector,
    createElement: hostCreateElement,
    insert: hostInsert
  } = options

  const _createElement = (vnode) => {
    const elm = hostCreateElement(vnode.tag)
    if(typeof vnode.children === 'string') {
      elm.textContent = vnode.children
    } else {
      vnode.children.forEach(vdom => {
        const child = _createElement(vdom)
        hostInsert(child, elm)
      })
    }
    vnode.el = elm
    return elm
  }

  const mount = (vnode, container) => {
    const dom = _createElement(vnode)
    hostInsert(dom, container)
    container._vnode = vnode
  }

  // 更新text
  const patch = (n1, n2, container) => {
    const el = n2.el = n1.el
    if(n1.tag === n2.tag) {
      // update props
      // update children
      const oldCh = n1.children
      const newCh = n2.children
      // text update
      if(typeof newCh === "string") {
        if(typeof oldCh === "string") {
          if(newCh !== oldCh) {
            el.textContent = newCh
          }
        }
      }
    }
  }

  const render = (vnode, container) => {
    if(container._vnode) {
      // diff
      patch(container._vnode, vnode, container)
    } else {
      // init
      mount(vnode, container)
    }
  }

  return {
    render,
    createApp: createAppAPI(render)
  }
}


function createAppAPI (render) {
  return function createApp (rootComponent) {
    // 创建app并返回
    const app = {}

    // 虚拟dom -> dom
    app.mount = (rootContainer) => {
      // 1. 获取vnode
      // 通过渲染器获取/根实例的渲染函数
      // 通过rootContainer渲染函数获取vnode
      app.proxy = _reactive(rootComponent.data())
      // 数据发送变化重新render
      _effect(() => {
        const vnode = rootComponent.render.call(app.proxy)
        // 2. 执行render
        render(vnode, document.querySelector(rootContainer))
      })

      return app
    }
    return app
  }
}

window.self_Vue = {
  createApp (options) {
    return renderer.createApp(options)
  },

  h(tag, props, children) {
    return { tag, props, children }
  }
}
