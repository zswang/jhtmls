var assert = require('should');
var jhtmls = require('..');
var fs = require('fs');
var util = require('util');

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name, 'utf8').replace(/\r/g, '');
}

describe('render(String)', function() {
  it('生成渲染函数 error.', function() {
    var render = jhtmls.render('#{x + y}');
    assert.equal('3', render({ x: 1, y: 2 }));
    assert.equal('12', render({ x: 5, y: 7 }));
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

  it('函数注释模板，处理 $ 、# 混用 error.', function() {
    var render = jhtmls.render(function() {/*!
var $length = data.length;
<li><a href="$url">$title - #{$length * 5}</a></li>
    */});
    assert.equal(
      '<li><a href="http://www.baidu.com">baidu - 25</a></li>',
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
      '\
<li><a href="http://www.baidu.com">baidu</a></li>\n\
<li><a href="http://www.baidu.com">baidu</a></li>',
      render({
        title: 'baidu',
        url: 'http://www.baidu.com'
      })
    );
  });

});

describe('render(String, Object, Object)', function() {
  it('使用 helper 扩展处理 error.', function() {
    var render = jhtmls.render(function() {/*!
<li><a href="#{url}">!#{helper.color(title, 'red')}</a></li>
    */});
    assert.equal(
      '<li><a href="http://www.baidu.com"><span style="color: red;">baidu</span></a></li>',
      render({
        title: 'baidu',
        url: 'http://www.baidu.com'
      }, {
        color: function(text, color) {
          return jhtmls.render(
            '<span style="color: #{color};">#{text}</span>', 
            {
              text: text,
              color: color
            }
          );
        }
      })
    );
  });
});

describe('fixtures', function() {
  var items = fs.readdirSync('test/fixtures').filter(function(item) {
    return /\.html$/.test(item);
  }).map(function(item) {
    return item.replace(/\.html$/, '');
  });

  items.forEach(function(item) {
    var text_html = String(fs.readFileSync(util.format('test/fixtures/%s.html', item)));
    var text_jhtmls = String(fs.readFileSync(util.format('test/fixtures/%s.jhtmls', item)));
    var json = JSON.parse(fs.readFileSync(util.format('test/fixtures/%s.json', item)));

    var file_helper = util.format('test/fixtures/%s.helper', item);
    if (fs.existsSync(file_helper)) {
      var helper = new Function(
        'return (' + fs.readFileSync(file_helper) + ')'
      )();
      it(item, function() {
        assert.equal(text_html, jhtmls.render(text_jhtmls, json, helper));
      });
    } else {
      it(item, function() {
        assert.equal(text_html, jhtmls.render(text_jhtmls, json));
      });
    }
  });
});