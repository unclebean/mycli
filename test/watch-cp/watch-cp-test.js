var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");


chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var fs = require('fs-extra');
var async = require('async');
var WatchCP = require("../../src/watch-cp/");

describe('WatchCP', function() {
  describe('monitor()', function () {
    it('fs.watch & async.queue should be called', function () {
      sinon.stub(async, 'queue', function(){});
      sinon.stub(fs, 'watch', function(){});
      WatchCP.monitor('./', './testDEST');
      sinon.assert.calledOnce(async.queue);
      sinon.assert.calledOnce(fs.watch);
      async.queue.restore();
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
