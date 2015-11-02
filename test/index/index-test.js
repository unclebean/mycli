var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");


chai.use(sinonChai);
var expect = chai.expect,
    assert = chai.assert,
    should = chai.should();

var fs = require('fs-extra');
var main = require("../../src/index.js");
var WatchCP = require("../../src/watch-cp/");
var HTTPServer = require("../../src/http-server/");

describe('main', function() {
  it('give "watch-cp" then WatchCP should be called.', function(){
    var spy = sinon.spy(WatchCP, 'monitor');
    main({'_':['watch-cp', 'source', 'destination']});
    spy.should.have.been.calledWith('source', 'destination');
  });
  it('give "http-server" then HTTPServer.startHTTP should be called', function(){
    var spy = sinon.spy(HTTPServer, 'startHTTP');
    main({'_':['http-server', './', 2323], extions:''});
    spy.should.have.been.calledWith('./', 2323, '');
  });
  it('give "http-server" and "https=true" then HTTPServer.startHTTPS should be called', function(){
    var spy = sinon.spy(HTTPServer, 'startHTTPS');
    main({'_':['http-server', './', 2323], https:true, extions:''});
    spy.should.have.been.calledWith('./', 2323, '');
  });
});
