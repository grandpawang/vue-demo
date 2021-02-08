/* eslint-disable no-unexpected-multiline */
const shape = {
  radius: 10,
  diameter () {
    return this.radius * 2
  },
  perimeter: () => 2 * Math.PI * this.radius,
  perimeter2: {
    test: () => 2 * Math.PI * this.radius
  }
}

console.log(shape.diameter()) // 20
console.log(shape.perimeter()) // NaN
console.log(shape.perimeter2.test()) // NaN

function Test () {
  this.radius = 10
  this.diameter = function () {
    return this.radius * 2
  }
  this.perimeter = () => 2 * Math.PI * this.radius
  const perimeter = {
    test: () => 2 * Math.PI * this.radius
  }
  console.log('Test', perimeter.test())
}

Test()

const o = new Test()

console.log(o.diameter()) // 20
console.log(o.perimeter()) // 62.83185307179586
const oPerimeter = o.perimeter
console.log(oPerimeter()) // 62.83185307179586
