const path = require('path')
const fs = require('fs')
const vm = require('vm')

/**
 * 引入
 * @param {string} modulePath 模板路径
 */
function _require (modulePath) {
  const ext = Module.getPath(modulePath)
  if (Module.cache[ext]) { // 查询缓存
    return Module.cache[ext]; // 查询到缓存，使用缓存
  }
  const module = new Module(ext)
  const extName = path.extname(ext)
  const result = Module.extensions[extName](module)
  Module.cache[ext] = module; // 计入缓存
  return result
}

/**
 * 模板
 * @param {string} id 模板唯一id
 */
function Module (id) {
  this.id = id;
  this.exports = {};
}

Module.cache = {};
Module.extensions = {}

/**
 * 引入js
 * @param {string} module
 */
Module.extensions['.js'] = function (module) {
  const script = fs.readFileSync(module.id, 'utf8');
  const wrapper = `(function (exports, require, module, __dirname, __filename) {${script}})`;
  const fn = vm.runInThisContext(wrapper); // vm.runInThisContext返回封装的那个方法
  fn(module.exports, _require, module, __dirname, __filename);
  return module.exports;
};

/**
 * 引入json
 * @param {string} module
 */
Module.extensions['.json'] = function (module) {
  const jsonContent = fs.readFileSync(module.id, 'utf8');
  return JSON.parse(jsonContent);
};

Module.getPath = function (id) {
  const absPath = path.resolve('jsbase', 'modules', 'commonjs', id); // 获得绝对路径
  if (fs.existsSync(absPath)) { // 若输入的路径已包含后缀，可以直接找到
    return absPath;
  }
  const extensions = Object.keys(Module.extensions);
  for (let i = 0; i < extensions.length; i++) {
    const ext = absPath.match(extensions[i])
      ? absPath
      : `${absPath}${extensions[i]}`;
    if (fs.existsSync(ext)) {
      return ext;
    }
  }
  throw new Error('The file do not exist'); // 加上后缀还没找到，抛出错误
}


const fn = _require('./a.js')
const json = _require('./a.json')
fn()
console.log(json)
