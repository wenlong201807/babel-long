const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;

// mock 待改造的源码
let source = `var fn = function() {
  console.log(111)
}`;

// 1、解析
let ast = parser.parse(source, {
  sourceType: "module",
  plugins: ["dynamicImport"]
});

//所有函数表达都会走到 FunctionExpression 中，然后我们可以在里面对其进行修改。
//其中参数 path 用于访问到当前的节点信息 path.node，
//也可以像 DOM 树访问到父节点的方法 path.parent

// 2、遍历
traverse(ast, {
  FunctionExpression (path, state) { // Function 节点
    // console.log('path:',path)
    console.log('state:',state) // undefined
    console.log('path--type:',typeof path) // object
  },
});