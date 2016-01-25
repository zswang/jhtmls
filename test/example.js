var assert = require('should');
var jhtmls = require('../.');
var util = require('util');
var printValue;
function print(value) {
  if (typeof printValue !== 'undefined') {
    throw new Error('Test case does not match.');
  }
  printValue = value;
}
describe("./src/jhtmls.js", function () {
  printValue = undefined;
  it("isOutput():expression 1", function () {
    print(jhtmls.isOutput('print: #{$name}'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():expression 2", function () {
    print(jhtmls.isOutput('print: !#{$title}'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Begin \"&\"", function () {
    print(jhtmls.isOutput('& 8848'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Begin \"=\"", function () {
    print(jhtmls.isOutput('= 8848'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Begin \":\"", function () {
    print(jhtmls.isOutput(': 8848'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Begin \"|\"", function () {
    print(jhtmls.isOutput('| 8848'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Begin \"汉字\"", function () {
    print(jhtmls.isOutput('汉字'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Begin \"<\"", function () {
    print(jhtmls.isOutput('<li>item1</li>'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Begin \"##\"", function () {
    print(jhtmls.isOutput('## title'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("isOutput():Keyword \"else\"", function () {
    print(jhtmls.isOutput('else'));
    assert.equal(printValue, false); printValue = undefined;
  });
  it("isOutput():Keyword \"void\"", function () {
    print(jhtmls.isOutput('void'));
    assert.equal(printValue, false); printValue = undefined;
  });
  it("isOutput():Keyword \"try\"", function () {
    print(jhtmls.isOutput('try'));
    assert.equal(printValue, false); printValue = undefined;
  });
  it("isOutput():Keyword \"finally\"", function () {
    print(jhtmls.isOutput('finally'));
    assert.equal(printValue, false); printValue = undefined;
  });
  it("isOutput():Keyword \"do\"", function () {
    print(jhtmls.isOutput('do'));
    assert.equal(printValue, false); printValue = undefined;
  });
  it("isOutput():Not keyword \"hello\"", function () {
    print(jhtmls.isOutput('hello'));
    assert.equal(printValue, true); printValue = undefined;
  });
  it("build():base", function () {
    print(typeof jhtmls.build('print: #{name}'));
    assert.equal(printValue, "function"); printValue = undefined;
  });
  it("build():Empty string", function () {
    print(typeof jhtmls.build(''));
    assert.equal(printValue, "function"); printValue = undefined;
  });
  it("render():Build Function", function () {
    print(typeof jhtmls.render('print: #{name}'));
    assert.equal(printValue, "function"); printValue = undefined;
  });
  it("render():Format String", function () {
    print(jhtmls.render('print: #{name}', { name: 'zswang' }));
    assert.equal(printValue, "print: zswang"); printValue = undefined;
  });
  it("render():this", function () {
    print(jhtmls.render('print: #{this}', 2016));
    assert.equal(printValue, "print: 2016"); printValue = undefined;
  });
});
