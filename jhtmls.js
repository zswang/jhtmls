(function (exportName) {
  var exports = exports || {};
  /**
   * @file jhtmls
   *
   * JS and HTML alternate javascript template
   * @author
   *   zswang (http://weibo.com/zswang)
   *   zinkey (http://weibo.com/zinkey)
   * @version 0.1.13
   * @date 2015-12-12
   */
  var htmlEncodeDict = {
    '"': 'quot',
    '<': 'lt',
    '>': 'gt',
    '&': 'amp',
    ' ': 'nbsp'
  };
  /**
   * HTML编码
   *
   * @inner
   * @param {string} text 文本
   */
  function encodeHTML(text) {
    return String(text).replace(/["<>& ]/g, function (all) {
      return '&' + htmlEncodeDict[all] + ';';
    });
  }
  /**
   * 构造模板的处理函数
   *
   * 不是 JS 行的正则判断
   *   碰见替换表达式
   *     示例：title: #{title}
   *     正则：/^.*#\{[^}]*\}.*$/mg
   *   特殊字符开通
   *     示例：&、=、:、|
   *     正则：/^[ \t]*[&=:|].*$/mg
   *   非 JS 字符开头
   *     示例：#、<div>、汉字
   *     正则：/^[ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():;, \t=\.$_]|:\/\/).*$/mg
   *   不是 else 等单行语句
   *     示例：hello world
   *     正则：/^(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\[\],\n|=&\/^?]+$/mg
   *
   * @inner
   * @param {string} template 模板字符
   * @return {function} 返回编译后的函数
   */
  function build(template) {
    if (!template) {
      return function () {
        return '';
      };
    }
    template = String(template).replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
      .replace(/^\uFEFF/, ''); // 数据清洗
    var body = [];
    body.push('with(this){');
    body.push(template
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, function (all) { // 处理<script>和<style>原样输出
        return ['!#{unescape("', escape(all), '")}'].join('');
      })
      .replace(/[\r\n]+/g, '\n') // 去掉多余的换行，并且去掉IE中困扰人的\r
      .replace(/^\n+|\s+$/mg, '') // 去掉空行，首部空行，尾部空白
      .replace(
        /^(.*#\{[^}]*\}.*|[ \t]*[&=:|].*|[ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():;, \t=\.$_]|:\/\/).*$|(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\[\],\n|=&\/^?]+$)\s?/mg,
        function (expression) { // 输出原文
          // 处理空白字符
          expression = expression
            .replace(/&none;/g, '') // 空字符
          .replace(/(!?#)\{("([^\\"]|(\\.))*"|'([^\\']|(\\.))*'|[^}]*)\}/g, function (all, flag, value) {
            return flag + '{' + value.replace(/\}/g, '\\x7d').replace(/\\/g, '\\x5c') + '}';
          })
            .replace(/["'\\]/g, '\\$&') // 处理转义符
          .replace(/\n/g, '\\n') // 处理回车转义符
          .replace( // #{expression} | $name
            /(!?#)\{(.*?)\}|(!?\$)([a-z_]+\w*(?:\.[a-z_]+\w*)*)/g,
            function (all, flag, value, flag2, value2) { // 变量替换
              if (flag2) { // 匹配 $name
                flag = flag2;
                value = value2;
              }
              if (!value) {
                return '';
              }
              // 还原转义
              value = value.replace(/\\n/g, '\n')
                .replace(/\\([\\'"])/g, '$1')
                .replace(/\\x7d/g, '}')
                .replace(/\\x5c/g, '\\');
              var identifier = /^[a-z$][\w+$]+$/i.test(value) &&
                !(/^(true|false|NaN|null|this)$/.test(value)); // 单纯变量，加一个未定义保护
              return ["',",
                identifier ? ['typeof ', value, "==='undefined'?'':"].join('') : '', (flag === '#' || flag === '$' ? '_encode_' : ''),
                '(', value, "),'"
              ].join('');
            }
          );
          // 处理输出
          expression = ["'", expression, "'"].join('').replace(/^'',|,''$/g, ''); // 去掉多余的代码
          if (expression && expression !== "_encode_('')") {
            return ['_output_.push(', expression, ');'].join('');
          }
          return '';
        }
      )
    );
    body.push('}');
    /*<debug>
    console.log(body.join(''));
    //</debug>*/
    return new Function(
      '_output_', '_encode_', 'helper', 'jhtmls', 'require',
      body.join('')
    );
  }
  /**
   * 格式化输出
   *
   * @param {string|Function} template 模板本身 或 模板放在函数行注释中
   * @param {Object} data 格式化的数据，默认为空字符串
   * @param {Object} helper 附加数据(默认为渲染函数)
   * @return {Function|string} 如果只有一个参数则返回渲染函数，否则返回格式化后的字符串
   */
  function render(template, data, helper) {
    if (typeof template === 'function') { // 函数多行注释处理
      template = String(template).replace(
        /[^]*\/\*!?\s*|\s*\*\/[^]*/g, // 替换掉函数前后部分
        ''
      );
    }
    var fn = build(template);
    /**
     * 格式化
     *
     * @inner
     * @param {Object} d 数据
     * @param {Object} h 辅助对象 helper
     */
    var format = function (d, h) {
      var _require;
      if (typeof require === 'function') {
        _require = require;
      }
      // h = h || fn;
      var output = [];
      if (typeof h === 'undefined') {
        h = function (d) {
          fn.call(d, output, encodeHTML, h, exports, _require);
        };
      }
      fn.call(d, output, encodeHTML, h, exports, _require);
      return output.join('');
    };
    if (arguments.length <= 1) { // 无渲染数据
      return format;
    }
    return format(data, helper);
  }
  exports.render = render;
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function () {
        return exports;
      });
    }
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }
  else {
    window[exportName] = exports;
  }
})('jhtmls');