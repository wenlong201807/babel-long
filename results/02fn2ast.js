const parser = require("@babel/parser");

// 先来定义一个简单的函数
let source = `var fn = function (n) {
  console.log(111)
}`;

// 解析为 ast
let ast = parser.parse(source, {
  sourceType: "module",
  plugins: ["dynamicImport"]
});

// 打印一下看看，是否正常
console.log(ast);