var jhtmls = typeof exports == 'undefined' ? jhtmls || {} : exports;

void function(exports) {
  'use strict';
  /**
   * jhtmls
   * 一套基于HTML和JS语法自由穿插的模板系统
   * @author 王集鹄(wangjihu,http://weibo.com/zswang) 鲁亚然(luyaran,http://weibo.com/zinkey)
   * @version 2014-05-21
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
   * @param {String} text 文本
   */
  function encodeHTML(text) {
    return String(text).replace(/["<>& ]/g, function(all) {
      return '&' + htmlEncodeDict[all] + ';';
    });
  }

  /**
   * 构造模板的处理函数
   * 不是 JS 行的正则判断
   *   非 JS 字符开头
   *     示例：#、<div>、汉字
   *     正则：/^[ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():; \t=\.$_]|:\/\/).*$/mg
   *   不是 else 等单行语句
   *     示例：hello world
   *     正则：/^(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\n|=&\/^?]+$/mg
   * @param {String} template 模板字符
   * @return {Function} 返回编译后的函数
   */
  function build(template) {
    var body = [];
    body.push('with(this){');
    body.push(template
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, function(all) { // 处理<script>和<style>原样输出
        return ['#{unescape("', escape(all), '")}'].join('');
      })
      .replace(/[\r\n]+/g, '\n') // 去掉多余的换行，并且去掉IE中困扰人的\r
      .replace(/^\n+|\s+$/mg, '') // 去掉空行，首部空行，尾部空白
      .replace(/^([ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():; \t=\.$_]|:\/\/).*$|^(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\n|=&\/^?]+$)\s?/mg,
        function(expression) { // 输出原文

          // 处理空白字符
          expression = expression
            .replace(/&none;/g, '') // 空字符
            .replace(/["'\\]/g, '\\$&') // 处理转义符
            .replace(/\n/g, '\\n'); // 处理回车转义符

          // 处理变量 
          expression = expression.replace( // #{expression} | $name
            /(!?#)\{(.*?)\}|(!?\$)([a-z_]+\w*(?:\.[a-z_]+\w*)*)/g,
            function (all, flag, value, flag2, value2) { // 变量替换
              if (!flag) { // 匹配 $name
                flag = flag2;
                value = value2;
              }
              if (!value) {
                return '';
              }
              value = value.replace(/\\n/g, '\n').replace(/\\([\\'"])/g, '$1'); // 还原转义

              var identifier = /^[a-z$][\w+$]+$/i.test(value) &&
                !(/^(true|false|NaN|null|this)$/.test(value)); // 单纯变量，加一个未定义保护

              return ["',", 
                identifier ? ['typeof ', value, "=='undefined'?'':"].join('') : '',
                (flag == '#' || flag == '$' ? '_encode_' : ''),
                '(', value, "),'"
              ].join('');
            }
          );

          // 处理输出
          expression = ["'", expression, "'"].join('').replace(/^'',|,''$/g, ''); // 去掉多余的代码

          if (expression) {
            return ['_output_.push(', expression, ');'].join('');
          }

          return '';
        }
      )
    );
    body.push('}');

    /* DEBUG *
    console.log(body.join(''));
    //*/
    return new Function('_output_', '_encode_', 'helper', body.join(''));
  }
  
  /**
   * 格式化输出
   * @param {String|Function} template 模板本身 或 模板放在函数行注释中
   * @param {Object} data 格式化的数据，默认为空字符串
   * @param {Object} helper 附加数据(默认为模板对象)
   * @return {Function|String} 如果只有一个参数则返回渲染函数，否则返回格式化后的字符串
   */
  function render(template, data, helper) {
    
    if (typeof template == 'function') { // 函数多行注释处理
      template = String(template).replace(
        /^[^\{]*\{\s*\/\*!?[ \f\t\v]*\n?|[ \f\t\v]*\*\/[;|\s]*\}$/g, // 替换掉函数前后部分
        ''
      );
    }

    var fn = build(template);

    var format = function(d, h) {
      h = h || exports;
      var output = [];
      fn.call(d, output, encodeHTML, h);
      return output.join('');
    };

    if (arguments.length <= 1) { // 无渲染数据
      return format;      
    }

    return format(data, helper);
  }

  exports.render = render;

}(jhtmls);