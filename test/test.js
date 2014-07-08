var assert = require('assert');
var jhtmls = require('../.');

describe('jhtmls', function() {
  describe('#render()', function() {
    it('#{this} error.', function() {
      assert.equal('1', jhtmls.render('#{this}', 1));
      assert.equal(2, jhtmls.render('#{this.length}', [1, 2]));
    });
  });
})