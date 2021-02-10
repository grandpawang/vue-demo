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

function foo2 (num) {
  const result = []
  if (num < 0) {
    num = -num
    result.push('-')
  }
  let [number, minNum] = String(num).split('.')
  const s = number.length % 3
  if (s !== 0) {
    number = number.padStart(number.length + 3 - s, '0')
  }
  const numbers = []
  number.replace(/\S{3}/gm, (s, s1, s2) => {
    numbers.push(s)
  })
  result.push(numbers.join(',').slice(3 - s))
  if (!minNum) {
    return result.join('')
  } else {
    return result.join('') + '.' + minNum
  }
}


console.log(foo(-1234567.159456))
console.log(foo2(-1234567.12345678))
