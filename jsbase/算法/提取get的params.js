function getUrlParam (sUrl, sKey) {
  const result = {};
  sUrl.replace(/\??(\w+)=(\w+)&?/g, function (a, k, v) {
    if (result[k] !== undefined) {
      const t = result[k];
      result[k] = [].concat(t, v);
    } else {
      result[k] = v;
    }
  });
  if (sKey === undefined) {
    return result;
  } else {
    return result[sKey] || '';
  }
}


export default getUrlParam
