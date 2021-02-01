const map = new window.AMap.Map('container', {
  center: [116.306206, 39.975468],
  zooms: [3, 10],
  zoom: 3
});

function getData (callback) {
  window.AMap.plugin('AMap.DistrictSearch', function () {
    const search = new window.AMap.DistrictSearch();
    search.search('中国', function (status, data) {
      if (status === 'complete') {
        const positions = []
        const provinces = data.districtList[0].districtList
        for (let i = 0; i < provinces.length; i += 1) {
          positions.push({
            center: provinces[i].center,
            radius: Math.max(2, Math.floor(Math.random() * 10))
          })
        }
        callback(positions)
      }
    });
  });
}
function addLayer (positions) {
  window.AMap.plugin('AMap.CustomLayer', function () {
    const canvas = document.createElement('canvas');
    const customLayer = new window.AMap.CustomLayer(canvas, {
      zooms: [3, 10],
      alwaysRender: true, // 缩放过程中是否重绘，复杂绘制建议设为false
      zIndex: 120
    });
    const onRender = function () {
      const retina = window.AMap.Browser.retina;
      const size = map.getSize();// resize
      let width = size.width;
      let height = size.height;
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      if (retina) { // 高清适配
        width *= 2;
        height *= 2;
      }
      canvas.width = width;
      canvas.height = height;// 清除画布
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#08f';
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      for (let i = 0; i < positions.length; i += 1) {
        const center = positions[i].center;
        let pos = map.lngLatToContainer(center);
        let r = positions[i].radius;
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
    }
    customLayer.render = onRender;
    customLayer.setMap(map);
  });
}
getData(addLayer);
