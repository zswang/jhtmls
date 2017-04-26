var jhtmls = require('../');

describe("src/jhtmls.js", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }

  it("isOutput():expression 1", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('print: #{$name}'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():expression 2", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('print: !#{$title}'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Begin \"&\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('& 8848'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Begin \"=\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('= 8848'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Begin \":\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput(': 8848'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Begin \"|\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('| 8848'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Begin \"汉字\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('汉字'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Begin \"<\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('<li>item1</li>'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Begin \"##\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('## title'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Keyword \"else\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('else'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Keyword \"void\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('void'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Keyword \"try\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('try'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Keyword \"finally\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('finally'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Keyword \"do\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('do'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Not keyword \"hello\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('hello'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():No semicolon \"foo()\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('foo()'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Not symbol \"return !todo.completed\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('return !todo.completed'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Strings Template \"`${name}`\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('`${name}`'));
    assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
  });
  it("isOutput():Strings Template \"\\`\\`\\`js\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('\`\`\`js'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("isOutput():Url \"http://jhtmls.com/\"", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.isOutput('http://jhtmls.com/'));
    assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
  });
  it("build():base", function() {
    examplejs_printLines = [];
    examplejs_print(typeof jhtmls.build('print: #{name}'));
    assert.equal(examplejs_printLines.join("\n"), "function"); examplejs_printLines = [];
  });
  it("build():Empty string", function() {
    examplejs_printLines = [];
    examplejs_print(typeof jhtmls.build(''));
    assert.equal(examplejs_printLines.join("\n"), "function"); examplejs_printLines = [];
  });
  it("render():Build Function", function() {
    examplejs_printLines = [];
    examplejs_print(typeof jhtmls.render('print: #{name}'));
    assert.equal(examplejs_printLines.join("\n"), "function"); examplejs_printLines = [];
  });
  it("render():Format String", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.render('print: #{name}', { name: 'zswang' }));
    assert.equal(examplejs_printLines.join("\n"), "print: zswang"); examplejs_printLines = [];
  });
  it("render():this & require is null", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.render('print: #{this}', 2016));
    assert.equal(examplejs_printLines.join("\n"), "print: 2016"); examplejs_printLines = [];
  });
  it("render():encodeHTML", function() {
    examplejs_printLines = [];
    examplejs_print(jhtmls.render('print: #{this}', '\' "'));
    assert.equal(examplejs_printLines.join("\n"), "print: &#39; &#34;"); examplejs_printLines = [];
    examplejs_print(jhtmls.render('print: !#{this}', '\' "'));
    assert.equal(examplejs_printLines.join("\n"), "print: ' \""); examplejs_printLines = [];
  });
});