function foo (num) {
  let op = true
  if (typeof num !== 'number') {
    throw new Error('is not number')
  }

  if (num < 0) {
    op = false
    num = -num
  }

  const str = String(num)
  let [tmp, point] = str.split('.')
  const _num = new Array(tmp.length)
  for (let i = tmp.length - 1; i >= 0; i--) {
    if (i % 3 === 0) {
      _num[i] = tmp[i] + ','
    } else {
      _num[i] = tmp[i]
    }
  }
  num = _num.join('')

  if (!op) {
    tmp = `-${num[num.length - 1] === ',' ? num.slice(0, -1) : num}`
  }
  if (point) {
    tmp += `.${point}`
  }
  return tmp
}


const res = foo(-1234567.159456)
console.log(res)
