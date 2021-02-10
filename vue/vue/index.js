import Dep from './core/dep'
import Compile from './compile/compile'
// import Wathcer from './core/watch'

export default class Vue {
  constructor (opts) {
    this.$data = opts.data
    this.$options = opts
    // 响应化处理
    this.observe(this.$data)

    // 编译模板 收集dom的数据依赖
    new Compile(opts.el, this)

    if (opts.created) {
      opts.created.call(this)
    }
  }

  observe (value) {
    if (!value || typeof value !== 'object') {
      return
    }
    Object.keys(value).forEach(key => {
      // 响应式处理
      this.defineReactive(value, key, value[key])
      // 代理数据带vue上
      this.proxyData(key)
    })
  }

  defineReactive (obj, key, val) {
    // 处理对象下面的值
    this.observe(val)

    const dep = new Dep()

    // 处理value
    Object.defineProperty(obj, key, {
      get () {
        // 依赖收集 当其他元素使用这个obj.key的时候
        // 获取他的watcher放进依赖中
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set (newVal) {
        if (newVal === val) {
          return
        }
        // 这里的val就是一个闭包的变量
        // get/set都是同一个闭包遍历
        // 不可以使用obj[key]修改 会导致重复调用get
        val = newVal
        // 通知依赖刷新
        dep.notify()
      }
    })
  }

  proxyData (key) {
    Object.defineProperty(this, key, {
      get () {
        return this.$data[key]
      },
      set (newVal) {
        this.$data[key] = newVal
      }
    })
  }
}
