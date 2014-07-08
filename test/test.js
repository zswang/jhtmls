var assert = require('should');
var jhtmls = require('..');
var fs = require('fs');

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name, 'utf8').replace(/\r/g, '');
}

describe('render(String)', function() {
  it('生成渲染函数 error.', function() {
    var render = jhtmls.render('#{x + y}');
    assert.equal('3', render({ x: 1, y: 2 }));
    assert.equal('12', render({ x: 5, y: 7}));
  });
});

describe('render(String, Object)', function() {
  it('直接渲染函数 error.', function() {
    assert.equal(3, jhtmls.render('#{x + y}', { x: 1, y: 2 }));
    assert.equal('<b>3</b>', jhtmls.render('<b>#{x + y}</b>', { x: 1, y: 2 }));
  });
});

describe('render(Function, Object)', function() {
  it('函数注释模板，处理 $ 简写 error.', function() {
    var render = jhtmls.render(function() {/*!
<li><a href="$url">$title - $data.length</a></li>
    */});
    assert.equal(
      '<li><a href="http://www.baidu.com">baidu - 5</a></li>',
      render({
        title: 'baidu',
        url: 'http://www.baidu.com',
        data: {
          length: 5
        }
      })
    );
  });
  it('函数注释模板，处理换行 error.', function() {
    var render = jhtmls.render(function() {/*!
<li><a href="#{url}">#{title}</a></li>
<li><a href="#{url}">#{title}</a></li>
    */});
    assert.equal(
      '<li><a href="http://www.baidu.com">baidu</a></li>\n<li><a href="http://www.baidu.com">baidu</a></li>',
      render({
        title: 'baidu',
        url: 'http://www.baidu.com'
      })
    );
  });
});