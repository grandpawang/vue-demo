onmessage = (evt) => {
  console.log('web worker start')
  const ctx = evt.data.canvas.getContext('2d')
  const color = ['red', 'yellow', 'blue', 'green', 'aqua', 'blue']
  let i = 0
  let lastTime = Date.now()
  setInterval(() => {
    ctx.fillStyle = color[i++ % 6]
    ctx.fillRect(0, 0, 100, 100)
    const now = Date.now()
    console.log(now - lastTime)
    lastTime = now
  }, 500)
}
