const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;

// mock 待改造的源码
let source = `var fn = function(n) {
  console.log(111)
}`;

// 1、解析
let ast = parser.parse(source, {
  sourceType: "module",
  plugins: ["dynamicImport"]
});

// 2、遍历
traverse(ast, {
  FunctionExpression (path, state) { // 函数表达式会进入当前方法
    // 获取函数当前节点信息
    var node = path.node, // 函数整体内容
      params = node.params,  // 函数中的参数内容
      blockStatement = node.body, // 这个就是原函数体内部代码片段
      isGenerator = node.generator, // 这段函数是否是生成器函数
      isAsync = node.async; // 这段代码是否为异步函数
    // 可以尝试打印看看结果
    // console.log('path:', path);
    console.log('node***:', node);
    console.log('params***:', params);
    console.log('blockStatement***:', blockStatement);
    console.log('isGenerator***:', isGenerator);
    console.log('isAsync***:', isAsync);
  }
});