let Vue;

const isPromise = val => val && typeof val.then === 'function'

class Store {
  constructor(options = {}) {
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    const { state: _state, getters: _getters, mutations: _mutations, actions: _actions } = options;

    const computed = {}
    this.getters = {}
    this.mutations = {}
    this.actions = {}

    // 定义getter
    Object.keys(_getters).forEach(k => {
      const v = _getters[k]
      // 定义getter未计算属性
      computed[k] = () => v(this.state)
      Object.defineProperty(this.getters, k, {
        get: () => this._vm[k]
      })
    })

    // mutations
    Object.keys(_mutations).forEach(k => {
      const v = _mutations[k]
      this.mutations[k] = (payload) => v(this.state, payload)
    })

    // actions
    Object.keys(_actions).forEach(k => {
      const v = _actions[k]
      this.actions[k] = (payload) => v(this.state, payload)
    })

    // 创建vue实例
    this._vm = new Vue({
      data: {
        $$state: _state
      },
      computed,
    })
  }

  get state() {
    return this._vm._data.$$state
  }

  commit(_type, _payload) {
    const entry = this.mutations[_type]
    entry(_payload)
  }

  dispatch(_type, _payload) {
    const entry = this.actions[_type](_payload)
    // 函数变成一个promise函数
    const promiseEntry = (isPromise(entry)
      ? entry
      : Promise.resolve(entry))
      .catch(err => {
        console.log(err)
      })
    return promiseEntry
  }

}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    return
  }
  Vue = _Vue

  // mixin store
  Vue.mixin({
    beforeCreate() {
      const options = this.$options
      // store injection
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }
  })
}

Vuex = {
  Store,
  install,
}
