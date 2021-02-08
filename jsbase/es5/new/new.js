function _new (constructor, ...args) {
  const o = Object.create(constructor.prototype)
  const result = constructor.apply(o, args)
  return result && typeof result === 'object' && result !== null
    ? result
    : o
}

function Person (name, age) {
  this.name = name
  this.age = age
}

const a = _new(Person, 'hello', 18)
const b = new Person('hello', 19)
console.log(a.name)
console.log(b.name)
