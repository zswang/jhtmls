# jhtmls

标签: 帮助文档 jhtmls 前端模板 javascript template

----

[![Build Status](https://img.shields.io/travis/zswang/jhtmls/master.svg)](https://travis-ci.org/zswang/jhtmls)
[![NPM version](https://img.shields.io/npm/v/jhtmls.svg)](http://badge.fury.io/js/jhtmls)

## 概述

### jhtmls 是什么？

在 Web 开发者，大部分的模板都是处理 HTML 格式。所以，我们针对这一特性设计一个专门处理 HTML 格式的前端模板。

`jhtmls` 会按行自动识别 JS 和 HTML 语法，所以不需要指定额外语法标记符（诸如：`<%%>`、`{{}}`）。这种设计是为了降低前端模板的学习和使用成本。

### jhtmls 解决什么问题？

尽可能少的输入字符，让写码的过程更流畅。

## 调用示例

```javascript
var data = [
  {
    title: '《哥斯拉》',
    date: 'today'
  },
  {
    title: '《钢铁侠》',
    date: 'tomorrow'
  }
];

var render = jhtmls.render(function() {/*!
<ul>
forEach(function (item) {
  with (item) {
  <li>$title -- $date</li>
  }
});
</ul>
*/});
var text = jhtmls.render('#{ JSON.stringify(this) }', data);

document.getElementById('main').innerHTML = render(data);
```

### 历史

为了便于 `jhtmls` 的发展和维护，从 `AceEngine` 抽出 [AceTemplate](https://code.google.com/p/ace-engine/wiki/AceTemplate) 。

## 语法识别情景

### 赋值语句

```
a = 1;
b = 2
```

### 表达式

```
typeof a
a / b
```

### 字符串

```
"双引号"
'单引号'
```

### 双目运算
```
a ? b : c
a && b ? c : 0
a | b ? c : 0
a ^ b ? c : 0
```

### 函数调用
```
a()
b(a, c)
```

### 邮箱地址

【命中】

```
admin@gmail.com
jack.tang@cctv.cn
```

### 链接地址

【命中】

```
http://www.baidu.com
ftp://baidu.com/files
```

### 普通单词

【命中】
```
hello
red
```

### 语法单词

```
else
do
try
finally
```

### 句子

【命中】
```
hello world
```

### 语法

```
{  }
```

### 转义变量

【命中】
```
#{value}
```