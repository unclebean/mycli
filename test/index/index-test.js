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
    sinon.stub(WatchCP, 'monitor', function(){});
    main({'_':['watch-cp', 'source', 'destination']});
    sinon.assert.calledOnce(WatchCP.monitor);
    WatchCP.monitor.restore();
  });
  it('give "http-server" then HTTPServer.startHTTP should be called', function(){
    sinon.stub(HTTPServer, 'startHTTP', function(){});
    main({'_':['http-server', './', 2323], extions:''});
    sinon.assert.calledOnce(HTTPServer.startHTTP);
    HTTPServer.startHTTP.restore();
  });
  it('give "http-server" and "https=true" then HTTPServer.startHTTPS should be called', function(){
    sinon.stub(HTTPServer, 'startHTTPS', function(){});
    main({'_':['http-server', './', 2323], https:true, extions:''});
    sinon.assert.calledOnce(HTTPServer.startHTTPS);
    HTTPServer.startHTTPS.restore();
  });
});
