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
        let positions = []
        const provinces = data.districtList[0].districtList
        for (let i = 0; i < provinces.length; i += 1) {
          positions = positions.concat(Array(100).fill(1).map((_, idx) => ({
            center: Object.keys(provinces[i].center).reduce((prev, curr) => {
              prev[curr] = provinces[i].center[curr] + Math.ceil(Math.random() * 30)
              return prev
            }, {}),
            radius: Math.max(2, Math.random() * 10)
          })))
          // positions.push({
          //   center: provinces[i].center,
          //   radius: Math.max(2, Math.floor(Math.random() * 10))
          // })
        }
        console.log('positions', positions.length)
        // 渲染点
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
    const worker = new Worker('./mapWorker.js');
    const offscreenCanvas = canvas.transferControlToOffscreen();

    const onRender = function () {
      const size = map.getSize(); // resize
      const retina = window.AMap.Browser.retina;
      const data = {
        positions: positions.map(pos => ({
          radius: pos.radius,
          ...map.lngLatToContainer(pos.center)
        })),
        size,
        retina
      }
      if (offscreenCanvas.width !== 0) {
        worker.postMessage({
          canvas: offscreenCanvas,
          ...data
        }, [offscreenCanvas]);
      } else {
        worker.postMessage({
          ...data
        }, []);
      }
    }
    customLayer.render = onRender;
    customLayer.setMap(map);
  });
}

getData(addLayer);
