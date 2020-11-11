const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
const t = require("babel-types");
const template = require("@babel/template");

// 0、定义一个待处理的函数（mock）
let source = `var fn = function() {
  console.log(111)
}`;

// 1、解析
let ast = parser.parse(source, {
  sourceType: "module",
  plugins: ["dynamicImport"]
});

// 2、遍历
traverse(ast, {
  FunctionExpression (path, state) { // Function 节点
    var node = path.node,
      params = node.params,
      blockStatement = node.body, // 函数function内部代码，将函数内部代码块放入 try 节点
      isGenerator = node.generator,
      isAsync = node.async;

    // 创建 catch 节点中的代码
    var catchStatement = template.statement(`ErrorCapture(error)`)();
    var catchClause = t.catchClause(t.identifier('error'),
      t.blockStatement(
        [catchStatement] //  catchBody
      )
    );
    // 创建 try/catch 的 ast
    var tryStatement = t.tryStatement(blockStatement, catchClause);

    // 创建新节点
    var func = t.functionExpression(node.id, params, t.BlockStatement([tryStatement]), isGenerator, isAsync);
    // 打印看看是否成功
    // console.log('当前节点是:', func);
    // console.log('当前节点下的子节点是:', func.body);

  }
});
