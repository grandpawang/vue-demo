

// 存储所有的rective，所有key对应的依赖
// 存储对象格式
// {
//   target1: {
//     ${key}: [effect1, effect2]
//   }
// }
const targetMap = new WeakMap()
// 副作用 所有函数的辅作用
const effectStack = []


// 收集依赖
// rective有多个 
// 一个有多个属性
function track(target, key){

  // 初始化targetMap对象 提取.target.key的所有依赖
  const effect = effectStack[effectStack.length - 1]
  if(effect) {
    let depMap = targetMap.get(target)
    if(!depMap) {
      // 原来没有建立依赖
      depMap = new Map()
      targetMap.set(target, depMap)
    }
    let dep = depMap.get(key)
    if(!dep) {
      dep = new Set()
      depMap.set(key, dep)
    }
    
    // 全局依赖添加该target依赖
    dep.add(effect)
  }

}

// 触发更新
function trigger(target, key, info){

  let depMap = targetMap.get(target)
  if(!depMap) {
    return
  } 

  const effects = new Set()
  const computedRunners = new Set()

  if(key) {
    let deps = depMap.get(key)
    deps.forEach(effect => {
      if (effect.computed) {
        computedRunners.add(effect)
      } else {
        effects.add(effect)
      }
    })
    computedRunners.forEach(computed => computed())
    effects.forEach(effect => effect())
  }
}


// 副作用 
//  => computed 特殊的effect
function effect(fn, options={}) {
  const e = createReactiveEffect(fn, options)

  if(!options.lazy) {
    e()
  }
  return e
}

const baseHandler = {
  get(target, key){
    const res = target[key]
    // 收集响应式依赖
    track(target, key)
    // 返回原本数据
    return res
  },
  set(target, key, val) {
    const info = {
      oldValue: target[key],
      newValue: val
    }
    // 触发原本更新
    target[key] = val
    // 触发响应式更新
    trigger(target, key, info)
  }
}


function reactive(target) {
  // target => 响应式
  const observer = new Proxy(target, baseHandler)

  return observer
}

// 创建双向绑定对象
function createReactiveEffect(fn, options={}) {
  // effect执行器工厂 
  //   => 执行运行effect对象
  function effect(...args) {
    return run(effect, fn, args)
  }

  // 后续
  清理以及缓存
  effect.deps = []
  effect.lazy = options.lazy
  effect.computed = options.computed 

  return effect
}

// effect执行器 
// effectStack的一个effect
function run(effect, fn, args) {
  if(effectStack.indexOf(effect) === -1) {
    try {
      effectStack.push(effect)
      console.log("push effect")
      return fn(...args)
    } finally {
      effectStack.pop()
    }
  }
}

function computed(fn) {

  // 添加全局副作用
  const runner = effect(fn, {
    computed: true,
    lazy: true
  })

  return {
    effect: runner,
    get value() {
      return runner()
    }
  }
}