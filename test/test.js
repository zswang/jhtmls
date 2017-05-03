var assert = require('should');
var jhtmls = require('../.');
var fs = require('fs');
var util = require('util');
global.require = require;

/**
 * 清除 \r，为兼容 Windows 下的文本换行符 CRLF
 */
function cleanCRLF(text) {
  return String(text).replace(/\r\n?/g, '\n');
}

// coverage

jhtmls.render()();
jhtmls.render('\r');
jhtmls.render("!#{'module.exports = require(\"./lib/' + name + '\");'}", {
  name: 'jdists'
});

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name, 'utf8').replace(/\r/g, '');
}

describe('render(String)', function() {
  it('生成渲染函数', function() {
    var render = jhtmls.render('#{x + y}');
    assert.equal('3', render({ x: 1, y: 2 }));
    assert.equal('12', render({ x: 5, y: 7 }));
  });
});

describe('render(String, Object)', function() {
  it('直接渲染函数', function() {
    assert.equal(3, jhtmls.render('#{x + y}', { x: 1, y: 2 }));
    assert.equal('<b>3</b>', jhtmls.render('<b>#{x + y}</b>', { x: 1, y: 2 }));
  });
});

describe('render(Function, Object)', function() {
  it('函数注释模板，处理换行', function() {
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
  it('使用 helper 扩展处理', function() {
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
    var text_html = cleanCRLF(fs.readFileSync(util.format('test/fixtures/%s.html', item)));
    var text_jhtmls = cleanCRLF(fs.readFileSync(util.format('test/fixtures/%s.jhtmls', item)));

    var file_json = util.format('test/fixtures/%s.json', item);
    var json;
    if (fs.existsSync(file_json)) {
      json = JSON.parse(fs.readFileSync(file_json));
    } else {
      json = {};
    }
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
