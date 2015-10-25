var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");


chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var fs = require('fs-extra');
var main = require("../../src/index.js");
var WatchCP = require("../../src/watch-cp/");


describe('main', function() {
  it('give "watch-cp" then WatchCP should be called.', function(){
    var spy = sinon.spy(WatchCP, 'monitor');
    main({'_':['watch-cp', 'source', 'destination']});
    spy.should.have.been.called;
  });
});
