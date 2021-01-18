function createAppAPI (render) {
  return function createApp (rootComponent) {
    // 创建app并返回
    const app = {}

    // 虚拟dom -> dom
    app.mount = (container) => {
      // 1. 获取vnode
      // 通过渲染器获取/根实例的渲染函数
      // 这里简单实现直接赋默认值<h2>{{foo}}</h2>
      const vnode = {
        tag: 'h2',
        props: null,
        children: rootComponent.data().foo
      }

      // 2. 执行render
      render(vnode, container)
    }
    return app
  }
}


function createRenderer (options) {
  // 创建render函数
  const { querySelector, createElement, insert } = options

  const render = (vnode, container) => {
    // 获取宿主元素
    const parent = querySelector(container)

    // 创建当前节点
    const child = createElement(vnode.tag)
    // 挂载文字
    if (typeof vnode.children === 'string') {
      child.innerText = vnode.children
    }

    insert(child, parent)
  }

  return {
    render,
    createApp: createAppAPI(render)
  }
}

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


window.self_Vue = {
  createApp (options) {
    return renderer.createApp(options)
  }
}
