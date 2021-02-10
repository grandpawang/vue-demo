
/**
 * 管理所有的watch
 * 一个obj.key对应一个dep
 * 一个obj.key有很多依赖(watcher)
 */
export default class Dep {
  // 保持当前watcher
  static target;
  constructor () {
    // 依赖的watcher
    this.deps = []
  }

  addDep (dep) {
    this.deps.push(dep)
  }

  notify () {
    this.deps.forEach(dep => dep.update())
  }
}
