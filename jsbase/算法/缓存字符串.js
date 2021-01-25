function cached (fn) {
  const cache = Object.create(null)
  return (str) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const _c = cached((str) => {
  return Math.ceil(Math.random() * 10e16)
})


function genRandomNumber (str) {
  return _c(str)
}

console.log(genRandomNumber('123'))
console.log(genRandomNumber('456'))
console.log(genRandomNumber('123'))
