import Vue from '../vue'

new Vue({
  el: '#app',
  data: {
    foo: 'foo',
    age: 12,
    html: '<div>hello</div>'
  },
  created () {
    setTimeout(() => {
      this.foo = 'setTimeout exec'
    }, 1500)
  },
  methods: {
    changeFoo () {
      this.foo = 'hello world'
      this.age = 1
    }
  }
})

