const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
const t = require("babel-types");
const template = require("@babel/template");
const core = require("@babel/core");
const LIMIT_LINE = 0


// 0、定义一个待处理的函数（mock）
let source = `var fn = function() {
  console.log(111)
}`;

const ASTFn = function (source) {
  // module.exports = function (source) { // 制作成一个npm 包


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
      /**
       * 1、如果有 try catch 包裹了
       * 2、防止 circle loops
       * 3、需要 try catch 的只能是语句，像 () => 0 这种的 body
       * 4、如果函数内容小于多少行数
       * */
      if (blockStatement.body && t.isTryStatement(blockStatement.body[0])
        || !t.isBlockStatement(blockStatement) && !t.isExpressionStatement(blockStatement)
        || blockStatement.body && blockStatement.body.length <= LIMIT_LINE) {
        return;
      }

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
      // 替换原节点
      path.replaceWith(func);
    }
  });

  // 将新生成的 AST，转为 Source 源码：
  return core.transformFromAstSync(ast, null, {
    configFile: false // 屏蔽 babel.config.js，否则会注入 polyfill 使得调试变得困难
  }).code;

}

let newFn = ASTFn(source)
console.log('newFn:', newFn)

// newFn: var fn = function () {
//   try {
//     console.log(111);
//   } catch (error) {
//     ErrorCapture(error);
//   }
// };