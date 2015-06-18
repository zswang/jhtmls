# jhtmls(#$)

[![Build Status](https://img.shields.io/travis/zswang/jhtmls/master.svg)](https://travis-ci.org/zswang/jhtmls)
[![NPM version](https://img.shields.io/npm/v/jhtmls.svg)](http://badge.fury.io/js/jhtmls)

## 概述

### jhtmls 是什么？

jhtmls 是一个不使用标记符的 Javascript 模板引擎，通过分析每一行的特征，自动区分「逻辑部分」和「输出部分」

> 举个栗子
>```html
<ul> 「输出部分」
	forEach(function(item)) {「逻辑部分」
		<li>「输出部分」
			<a href="#{item.url}" title="#{item.desc}">#{item.title}</a>「输出部分」
			if (item.photo) {「逻辑部分」
				<img src="#{item.photo}">「输出部分」
		  }「逻辑部分」
		</li>「输出部分」
	};「逻辑部分」
</ul>「输出部分」
>```

### 如今这么多 Javascript 前端模板，jhtmls 存在的意义是什么？

2011年 jhtmls 的前身 `AceTemplate` 就已经存在了，为方便迭代已从 AceEngine 项目中抽离出来。

如果只处理 HTML 格式，那么采用 Javascript 和 HTML 语法自然穿插的方式，学习和使用成本都很低了。

> 这种混插的方式与 JSX 类似。
>```
React.render(
    <div>
        <div>
            <div>content</div>
        </div>
    </div>,
    document.getElementById('example')
);
>```

### jhtmls 解决什么问题？

尽可能少的输入字符，让写码的过程更流畅。

## 如何使用

### 安装

+ node 环境 `$ npm install jhtmls`
+ 浏览器环境 `$ bower install jhtmls`

### 引用

```javascript
<script src="jhtmls.min.js"></script>
```

### 主要接口

```javascript
/**
 * 格式化输出
 *
 * @param {string|Function} template 模板本身 或 模板放在函数行注释中
 * @param {Object} data 格式化的数据，默认为空字符串
 * @param {Object} helper 附加数据(默认为渲染函数)
 * @return {Function|string} 如果只有一个参数则返回渲染函数，否则返回格式化后的字符串
 */
function render(template, data, helper) { ... }
```

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
forEach(function(item) {
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


## 识别「输出部分」语法图

![][1]


  [1]: http://divio.qiniudn.com/Fs9ikLJ0ncDZoKHPYPUR3kCK9i06