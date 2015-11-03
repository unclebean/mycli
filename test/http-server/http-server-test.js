var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var http = require('http');
var https = require('https');
var HTTPServer = require("../../src/http-server/");

describe('HTTPServer', function(){
  it('should create http server', function(){
    sinon.stub(http, 'createServer', function(){
      return {'listen':function(){}};
    });
    HTTPServer.startHTTP('./', 2323, '');
    sinon.assert.calledOnce(http.createServer);
    http.createServer.restore();
  });
});
