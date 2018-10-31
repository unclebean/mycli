var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var http = require('http');
var https = require('https');
var HTTPProxy = require("../../src/http-proxy/");
var Datastore = require('nedb');

describe('HTTPProxy', function(){
  var _options = null, db;
  beforeEach(function(){
    _options = {
      "server":{
        "port":8888,
        "proxyType":"HTTP",
        "replay":true
      },
      "target":{
        "host":"query.yahooapis.com",
        "port":80
      }
    };
    db = new Datastore({ filename: './proxyDB' });
    db.loadDatabase(function (err) {});
  });
  describe('startup', function(){
    before(function(){
      sinon.stub(http, 'createServer', function(callback){
        callback({'url':'/', 'on': () => {}}, {'headers':'', write:function(){}, end:function(){}});
        return {'listen':function(){}};
      });
    });
    after(function(){
      http.createServer.restore();
    });
    it('should create http server', function(){
      HTTPProxy.startup(_options);
      sinon.assert.calledOnce(http.createServer);
    });
  });
});
