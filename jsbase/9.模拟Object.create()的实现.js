function _create (o) {
  function F () {}
  F.prototype = o;
  return new F();
}


const person = {
  name: 'willem',
  colors: ['red', 'green', 'blue']
};

const p1 = _create(person);
p1.colors.push('white');
console.log(person, p1);
