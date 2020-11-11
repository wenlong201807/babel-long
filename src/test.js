const aa = require('./index')
console.log('aa:', aa)

let testFn = function () {
  console.log(111222)
}
console.log('====:', aa(testFn))

// 参考资料
// https://segmentfault.com/a/1190000037630766