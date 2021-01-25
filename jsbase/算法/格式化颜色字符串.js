function rgb2hex (sRGB) {
  const toHEX = (s) => ('0' + (+s).toString(16)).slice(-2)
  return sRGB.replace(/^rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)$/, (s, s1, s2, s3) => {
    return '#' + toHEX(s1) + toHEX(s2) + toHEX(s3);
  })
}


console.log(rgb2hex('rgb(0, 0, 0)'))
