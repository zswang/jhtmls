var fs = require('fs');
var input = process.argv[2];
var output = process.argv[3];

if (!input) {
  console.log('not input.');
  return;
}

if (!output) {
  console.log('not output.');
  return;
}

var body = fs.readFileSync(input);

body = String(body).
  // 清除调试代码 /* debug start */ ... /* debug end */
  replace(/\/\* debug start \*\/[\s\S]*?\/\* debug end \*\//g, '').
  // 处理函数注释字符串
  replace(
    /function\s*\(\s*\)\s*\{\s*\/\*\!([\s\S]*?)\*\/\s*\}/g,
    function(all, text) {
      return JSON.stringify(text);
    }
  );
fs.writeFileSync(output, body);