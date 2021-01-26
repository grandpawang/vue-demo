function newObj (name) {
  this.name = name
  this.getName = function (...args) {
    console.log(this.name, ...args)
  }
}

function _new (fn) {
  const result = Object.create(fn.prototype)
  const args = [].slice.call(arguments, 1)
  fn.apply(result, args)
  return result
}
const person = _new(newObj, 'newObj name');
console.log(person)
person.getName(1, 2, 3, 4)
