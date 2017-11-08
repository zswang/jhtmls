/**
 * @file jhtmls
 *
 * Unmarked front-end template
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 2.0.5
 * @date 2017-11-08
 */
export interface IRender {
    (data: any, helper?: any): string;
}
export interface IEncodeHTML {
    (text: string): string;
}
export interface IRenderInline {
    (output: string[], encode: IEncodeHTML, helper: any): string;
}
/**
 * 是否行是否输出
 *
 * @param {string} line 行的内容
 * @return {Boolean} 返回该行是否为内容输出
 '''<example>'''
 * @example isOutput():expression 1
  ```js
  console.log(jhtmls.isOutput('print: #{$name}'))
  // > true
  ```
 * @example isOutput():expression 2
  ```js
  console.log(jhtmls.isOutput('print: !#{$title}'))
  // > true
  ```
 * @example isOutput():number
  ```js
  console.log(jhtmls.isOutput('8848'))
  // > true
  ```
 * @example isOutput():Begin "&"
  ```js
  console.log(jhtmls.isOutput('& 8848'))
  // > true
  ```
 * @example isOutput():Begin "="
  ```js
  console.log(jhtmls.isOutput('= 8848'))
  // > true
  ```
 * @example isOutput():Begin ":"
  ```js
  console.log(jhtmls.isOutput(': 8848'))
  // > true
  ```
 * @example isOutput():Begin "|"
  ```js
  console.log(jhtmls.isOutput('| 8848'))
  // > true
  ```
 * @example isOutput():Begin "汉字"
  ```js
  console.log(jhtmls.isOutput('汉字'))
  // > true
  ```
 * @example isOutput():Begin "<"
  ```js
  console.log(jhtmls.isOutput('<li>item1</li>'))
  // > true
  ```
 * @example isOutput():Begin "##"
  ```js
  console.log(jhtmls.isOutput('## title'))
  // > true
  ```
 * @example isOutput():Keyword "else"
  ```js
  console.log(jhtmls.isOutput('else'))
  // > false
  ```
 * @example isOutput():Keyword "void"
  ```js
  console.log(jhtmls.isOutput('void'))
  // > false
  ```
 * @example isOutput():Keyword "try"
  ```js
  console.log(jhtmls.isOutput('try'))
  // > false
  ```
 * @example isOutput():Keyword "finally"
  ```js
  console.log(jhtmls.isOutput('finally'))
  // > false
  ```
 * @example isOutput():Keyword "do"
  ```js
  console.log(jhtmls.isOutput('do'))
  // > false
  ```
 * @example isOutput():Not keyword "hello"
  ```js
  console.log(jhtmls.isOutput('hello'))
  // > true
  ```
 * @example isOutput():No semicolon "foo()"
  ```js
  console.log(jhtmls.isOutput('foo()'))
  // > false
  ```
 * @example isOutput():Not symbol "return !todo.completed"
  ```js
  console.log(jhtmls.isOutput('return !todo.completed'))
  // > false
  ```
 * @example isOutput():Strings Template "`${name}`"
  ```js
  console.log(jhtmls.isOutput('`${name}`'))
  // > false
  ```
 * @example isOutput():Strings Template "\`\`\`js"
  ```js
  console.log(jhtmls.isOutput('\`\`\`js'))
  // > true
  ```
 * @example isOutput():Url "http://jhtmls.com/"
  ```js
  console.log(jhtmls.isOutput('http://jhtmls.com/'))
  // > true
  ```
 '''</example>'''
 */
declare function jhtmls_isOutput(line: string): boolean;
export { jhtmls_isOutput as isOutput };
/**
 * 构造模板的处理函数
 *
 * @param {string} template 模板字符
 * @return {function} 返回编译后的函数
 '''<example>'''
 * @example build():base
  ```js
  console.log(typeof jhtmls.build('print: #{name}'))
  // > function
  ```
 * @example build():Empty string
  ```js
  console.log(typeof jhtmls.build(''))
  // > function
  ```
 '''</example>'''
 */
declare function jhtmls_build(template: string): IRenderInline;
export { jhtmls_build as build };
/**
 * 格式化输出
 *
 * @param {string|Function} template 模板本身 或 模板放在函数行注释中
 * @param {Object} data 格式化的数据，默认为空字符串
 * @param {Object} helper 附加数据(默认为渲染函数)
 * @return {Function|string} 如果只有一个参数则返回渲染函数，否则返回格式化后的字符串
 '''<example>'''
 * @example render():Build Function
  ```js
  console.log(typeof jhtmls.render('print: #{name}'))
  // > function
  ```
 * @example render():Format String
  ```js
  console.log(jhtmls.render('print: #{name}', { name: 'zswang' }))
  // > print: zswang
  ```
 * @example render():this & require is null
  ```js
  console.log(jhtmls.render('print: #{this}', 2016))
  // > print: 2016
  ```
 * @example render():encodeHTML
  ```js
  console.log(jhtmls.render('print: #{this}', '\' "'))
  // > print: &#39 &#34
  console.log(jhtmls.render('print: !#{this}', '\' "'))
  // > print: ' "
  ```
 '''</example>'''
 */
declare function jhtmls_render(template: string | Function, data?: any, helper?: any): string | IRender;
export { jhtmls_render as render };
