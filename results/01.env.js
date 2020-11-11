/**
 * $ npm i -g yo
 * $ npm i -g generator-babel-plugin
 * 
 * mkdir babel-plugin-long
 * cd babel-plugin-long
 * 
 * $ yo babel-plugin
 * 
 * npm i @babel/core @babel/parser babel-traverse @babel/template babel-types -S
 * 
 * Babel 的运行的每个阶段主要分三个阶段：解析->转换->生成
 * 
 * babel-core。Babel 的核心库，提供了将代码编译转化的能力。
 * babel-types。提供 AST 树节点的类型。
 * babel-template。可以将普通字符串转化成 AST，提供更便捷的使用
 * 
*/