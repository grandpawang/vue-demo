import Dep from './dep';

/**
 * obj.key一个watcher
 * watcher在compile的时候创建
 * cb为处理dom更新的函数
 */
export default class Watcher {
  constructor (vm, key, cb) {
    // 创建实例时候 将Dep的target 便于依赖收集
    this.vm = vm
    this.key = key
    // update的时候执行的回调函数
    // 进行更新观察者
    this.cb = cb

    // 触发依赖收集
    Dep.target = this
    this.vm[this.key];
    Dep.target = null
  }

  update () {
    this.cb.call(this.vm, this.vm[this.key])
  }
}
