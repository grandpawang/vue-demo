class VueRouter {
  constructor({
    routes
  }) {
    this._routes = routes
    this.history = {
      current: "/",
      component: {
        template: "<div>default</div>"
      }
    }
    this.listen()
  }

  listen () {
    window.addEventListener("load", () => {
      const hash = window.location.hash.slice(1)
      if(!hash) { // 触发hashchange url => /#/
        window.location.hash = "/"
      }
    })

    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1)
      const route = this._routes.find(route => route.path === hash)
      if (route) {
        // vue2使用defineProperties对对象下的属性重写了get set收集依赖
        this.history.current = hash
        this.history.component = route.component
      }
    })
  }
}

let _Vue

VueRouter.install = function (Vue) {

  if (this.installed && _Vue === Vue) return
  this.installed = true

  const isDef = v => v !== undefined

  _Vue = Vue


  Vue.mixin({
    beforeCreate() {
      
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        Vue.util.defineReactive(this, "_route", this._router.history)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
    },

    destroyed () {

    }
  })

  Vue.component('RouterView', {
    render(h) {
      // _route是一个observer当history变化时触发dom更新 重新render
      let component = this._routerRoot._route.component
      return h(component)
    }
  })

  Vue.component('RouterLink', {
    props: {
      to: {
        type: String,
        required: true,
      }
    },
    render(h) {
      return h("a", { attrs: { href: "#" + this.$props.to } }, this.$slots.default)
    }
  })
}

VueRouter.version = '__VERSION__'

if (window.Vue) {
  window.Vue.use(VueRouter)
}
