// 创建地图实例
const map = new window.AMap.Map('container', {
  zoom: 13,
  center: [116.4, 39.92],
  resizeEnable: true
});


const num = 500

// 以 icon URL 的形式创建一个途经点
const viaMarker = Array(num).fill(1).map((_, idx) => new window.AMap.Marker({
  position: new window.AMap.LngLat(116.38, 39.92),
  // 将一张图片的地址设置为 icon
  icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
  // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
  offset: new window.AMap.Pixel(-13 + idx, -30 + idx)
}))

// 创建一个 Icon
const startIcon = new window.AMap.Icon({
  // 图标尺寸
  size: new window.AMap.Size(25, 34),
  // 图标的取图地址
  image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
  // 图标所用图片大小
  imageSize: new window.AMap.Size(135, 40),
  // 图标取图偏移量
  imageOffset: new window.AMap.Pixel(-9, -3)
})

// 将 icon 传入 marker
const startMarker = Array(num).fill(1).map((_, idx) => new window.AMap.Marker({
  position: new window.AMap.LngLat(116.35, 39.89),
  icon: startIcon,
  offset: new window.AMap.Pixel(-13 + idx, -30 + idx)
}))

// 创建一个 icon
const endIcon = new window.AMap.Icon({
  size: new window.AMap.Size(25, 34),
  image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
  imageSize: new window.AMap.Size(135, 40),
  imageOffset: new window.AMap.Pixel(-95, -3)
});

// 将 icon 传入 marker
const endMarker = Array(num).fill(1).map((_, idx) => new window.AMap.Marker({
  position: new window.AMap.LngLat(116.45, 39.93),
  icon: endIcon,
  offset: new window.AMap.Pixel(-13 + idx, -30 + idx)
}));

// 将 markers 添加到地图
map.add([...viaMarker, ...startMarker, ...endMarker]);
