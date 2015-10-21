var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");


chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var chokidar = require('chokidar');
var WatchCP = require("../src/watch-cp/");

describe('WatchCP', function() {
  describe('monitor()', function () {
    it('chokidar.watch should be called', function () {
      var spy = sinon.spy(chokidar, 'watch');
      WatchCP.monitor('testSRC', ['testDEST']);
      spy.should.have.been.called;
    });
  });
});
