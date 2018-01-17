/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

export interface IRender {
  (data: any, helper?: any): string
}

export interface IEncodeHTML {
  (text: string): string
}

export interface IRenderInline {
  (output: string[], encode: IEncodeHTML, helper: any): string
}

/*<function name="jhtmls_isOutput">*/
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
function jhtmls_isOutput(line: string): boolean {
  // 碰见替换表达式
  // 示例：title: #{title}
  if (/^.*#\{[^}]*\}.*$/.test(line)) {
    return true
  }

  // 特殊字符开头
  // 示例：&、=、:、|
  if (/^[ \t]*[&=:|].*$/.test(line)) {
    return true
  }

  // return 语句
  if (/^\s*return\b/.test(line)) {
    return false
  }

  // 非 JavaScript 字符开头
  // 示例：#、<div>、汉字
  if (/^[ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():,!` \t=\.$_]|:\/\/).*$/.test(line)) {
    return true
  }

  // ```
  if (/^\s*[`\-+'"]{3,}/.test(line)) {
    return true
  }

  // 不是 else 等单行语句
  // 示例：hello world
  if (/^(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'"`!:{}()\[\],\n|=&\/^?]+$/.test(line)) {
    return true
  }

  return false
} /*</function>*/

export {
  jhtmls_isOutput as isOutput
}


/*<function name="jhtmls_build" depend="jhtmls_isOutput">*/
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
function jhtmls_build(template: string): IRenderInline {
  if (!template) {
    return function () {
      return ''
    }
  }

  let lines = template.split(/\n\r?/).map((line, index, array) => {
    if (/^\s*$/.test(line)) {
      return line
    }
    else if (jhtmls_isOutput(line)) {
      let expressions = []
      let offset = 0
      line.replace(/(!?#)\{((?:"(?:[^\\"]|(?:\\.))*"|'(?:[^\\']|(?:\\.))*'|(?:[^{}]*\{[^}]*\})?|[^}]*)*)\}/g,
        (all, flag, value, index) => {
          let text = line.slice(offset, index)
          if (text) {
            expressions.push(JSON.stringify(text))
          }
          offset = index + all.length
          if (!value) {
            return ''
          }

          // 单纯变量，加一个未定义保护
          if (/^[a-z$][\w$]+$/i.test(value) &&
            !(/^(true|false|NaN|null|this)$/.test(value))) {
            value = `typeof ${value}==='undefined'?'':${value}`
          }
          switch (flag) {
            case '#':
              expressions.push(`_encode_(${value})`)
              break
            case '!#':
              expressions.push(`(${value})`)
              break
          }
          return ''
        })
      let text = line.slice(offset, line.length)
      if (text) {
        expressions.push(JSON.stringify(text))
      }
      if (index < array.length - 1) {
        expressions.push('"\\n"')
      }
      return `_output_.push(${expressions});`
    }
    else {
      return line
    }
  })
  lines.unshift('with(this){')
  lines.push('}')

  /*<remove>
  console.log(lines.join(''))
  //</remove>*/
  return new Function(
    '_output_', '_encode_', 'helper',
    lines.join('\n')
  ) as IRenderInline
} /*</function>*/

export {
  jhtmls_build as build
}

/*<jdists encoding="fndep" import="../node_modules/jstrs/lib/jstrs.ts" depend="encodeHTML">*/
import { encodeHTML } from 'jstrs'
/*</jdists>*/

/*<function name="jhtmls_render" depend="jhtmls_build,encodeHTML">*/
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
function jhtmls_render(template: string | Function, data?: any, helper?: any): string | IRender {

  if (typeof template === 'function') { // 函数多行注释处理
    template = String(template).replace(
      /[^]*\/\*!?\s*|\s*\*\/[^]*/g, // 替换掉函数前后部分
      ''
    )
  }

  let fn: IRenderInline = jhtmls_build(template)

  /**
   * 格式化
   *
   * @inner
   * @param {Object} d 数据
   * @param {Object} h 辅助对象 helper
   */
  let format = function (d: any, h: any): string {
    // h = h || fn
    let output = []
    if (typeof h === 'undefined') {
      h = function (d) {
        fn.call(d, output, encodeHTML, h)
      }
    }
    fn.call(d, output, encodeHTML, h)
    return output.join('')
  } as IRender


  if (arguments.length <= 1) { // 无渲染数据
    return format
  }

  return format(data, helper)
} /*</function>*/

export {
  jhtmls_render as render
}