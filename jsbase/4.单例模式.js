let _instance = null

function newInstance () {
  this.name = 'aasad'
}

function currentInstance () {
  if (_instance) return _instance
  _instance = new newInstance()
  return _instance
}


const a = currentInstance()
a.name = 'aaa'
console.log(a)
const b = currentInstance()
b.name = 'bbb'
console.log(a)
console.log(b)
