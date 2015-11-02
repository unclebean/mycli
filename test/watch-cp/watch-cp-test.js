var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");


chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var fs = require('fs-extra');
var WatchCP = require("../../src/watch-cp/");

describe('WatchCP', function() {
  describe('monitor()', function () {
    it('fs.watch should be called', function () {
      sinon.stub(fs, 'watch', function(){});
      WatchCP.monitor('./', './testDEST');
      sinon.assert.calledOnce(fs.watch);
      fs.watch.restore();
    });
  });
  describe('_copy()', function(){
    it('fs.copy should be called', function(){
      sinon.stub(fs, 'copy', function(){});
      WatchCP._copy('./source', './destination');
      sinon.assert.calledOnce(fs.copy);
      fs.copy.restore();
    });
  });
});
