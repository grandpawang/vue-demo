const map = new window.AMap.Map('container', {
  zoom: 4,
  center: [102.342785, 35.312316]
});

const style = [{
  url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
  anchor: new window.AMap.Pixel(6, 6),
  size: new window.AMap.Size(11, 11)
}, {
  url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
  anchor: new window.AMap.Pixel(4, 4),
  size: new window.AMap.Size(7, 7)
}, {
  url: 'https://a.amap.com/jsapi_demos/static/images/mass2.png',
  anchor: new window.AMap.Pixel(3, 3),
  size: new window.AMap.Size(5, 5)
}
];

// mass marker
const mass = new window.AMap.MassMarks(window.citys, {
  opacity: 0.8,
  zIndex: 111,
  cursor: 'pointer',
  style: style
});

const marker = new window.AMap.Marker({ content: ' ', map: map });

mass.on('mouseover', function (e) {
  marker.setPosition(e.data.lnglat);
  marker.setLabel({ content: e.data.name })
});

mass.setMap(map);
