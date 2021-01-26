const arr = [1, 1, 1, 4, 2, 3, 4, 5, 6, 1, 2, 3, 3, 4]


function unique (arr) {
  const res = []
  const _obj = {}
  arr.forEach(el => {
    if (!_obj[el]) {
      _obj[el] = true
      res.push(el)
    }
  })
  return res
}

console.log(unique(arr))
