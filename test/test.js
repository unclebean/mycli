var chai = require('chai'),
    spies = require('chai-spies');

chai.use(spies);
var should = chai.should(),
    expect = chai.expect;
    
var chokidar = require('chokidar');
var WatchCP = require("../src/watch-cp/");

describe('WatchCP', function() {
  describe('monitor()', function () {
    it('chokidar.watch should be called', function () {
      chai.spy.on(chokidar, 'watch');
      WatchCP.monitor('testSRC', ['testDEST']);
      expect(chokidar.watch).to.have.been.called();
    });
  });
});
