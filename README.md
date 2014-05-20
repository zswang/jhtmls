JhtmlS 是 AceTemplate 的升级版本

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
  with(item) {
  <li>#{title} -- #{date}</li>
  }
});
</ul>
*/});
var text = jhtmls.render('#{ JSON.stringify(this) }', data);

document.getElementById('main').innerHTML = render(data);
```