let canvas
let ctx

const canvasRenderer = window.Vue.createRenderer({
  // 创建节点
  createElement (tag) {
    return { tag }
  },
  // 设置属性
  patchProp (el, key, prev, next) {
    el[key] = next
  },
  // 插入元素
  insert (child, parent) {
    if (parent.nodeType === 1) {
      draw(child)
    }
  }
})

const draw = (el, noClear) => {
  if (!noClear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  if (el.tag === 'bar-chart') {
    const { data } = el
    const barWidth = canvas.width / 10
    const gap = 20
    const paddingLeft = (data.length * barWidth + (data.length - 1) * gap) / 2
    const paddingBottom = 10

    data.forEach(({ title, count, color }, idx) => {
      const x = paddingLeft + idx * (barWidth + gap)
      const y = canvas.height - paddingBottom - count
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, count)
    })
  }

  el.childs && el.childs.forEach(child => draw(child, true))
}



window.createCanvasApp = function createCanvasApp (App) {
  const app = canvasRenderer.createApp(App)

  // 追加挂载画布
  const mount = app.mount
  // 将bar-chart定义成自定义元素
  app.config.isCustomElement = tag => tag === 'bar-chart'
  app.mount = (container) => {
    // 创建画布
    canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300

    const parent = document.querySelector(container)
    parent.appendChild(canvas)

    ctx = canvas.getContext('2d')

    // 默认挂载
    mount(canvas)
  }

  return app
}




