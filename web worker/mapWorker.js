let _canvas = null
let timer = null
const delay = 500

onmessage = (evt) => {
  const canvas = evt.data.canvas
  const positions = evt.data.positions
  const size = evt.data.size
  const retina = evt.data.retina
  const image = evt.data.image
  console.log(image)
  if (canvas) {
    _canvas = canvas
  }
  let width = size.width;
  let height = size.height;
  _canvas.width = width
  _canvas.height = height
  if (retina) { // 高清适配
    width *= 2;
    height *= 2;
  }
  _canvas.width = width;
  _canvas.height = height;// 清除画布
  const ctx = _canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height)
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    console.log('render')
    ctx.fillStyle = '#08f';
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    for (let i = 0; i < positions.length; i += 1) {
      let r = positions[i].radius;
      let pos = positions[i]
      if (retina) {
        pos = pos.multiplyBy(2);
        r *= 2
      }
      ctx.moveTo(pos.x + r, pos.y)
      ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
    }
    ctx.lineWidth = retina ? 6 : 3
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }, delay)
}
