function namespace (oNamespace, sPackage) {
  sPackage.split('.').reduce((pre, cur) => {
    if (typeof pre[cur] !== 'object') {
      pre[cur] = {}
    }
    return pre[cur]
  }, oNamespace);
  return oNamespace
}

const a = namespace({ a: { test: 1, b: 2 } }, 'a.b.c.d')
console.log(a)

