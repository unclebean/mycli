var https = require('https'),
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    zlib = require('zlib'),
    querystring = require('querystring'),
    path = require('path');

var colors = require('../utils/');
var httpClient = require('./httpClient');
var ResponseModel = require('./models/responseModel');
var proxyDBRepository = require('./proxyDBRepository');
var staticFileHandler = require('./handlers/staticFileHandler');
var proxyDBHandler = require('./handlers/proxyDBHandler');

module.exports = {
    startup: function (proxyOptions) {
        var self = this,
            _port = parseInt(proxyOptions.server.port) ? proxyOptions.server.port : 5555,
            _options = proxyOptions.target,
            _whitelist = _options.whitelist || [];
        var _proxyType = proxyOptions.server.proxyType ? proxyOptions.server.proxyType : "HTTP";
        try {
            _options.key = fs.readFileSync(_options.key, 'utf8');
            _options.cert = fs.readFileSync(_options.cert, 'utf8');
        } catch (e) {
        }
        proxyDBRepository.init();
        staticFileHandler.setRootPath(__dirname);
        proxyDBHandler.init(proxyOptions);
        self.registerHandler('^/proxyDB$', staticFileHandler.getIndexPage);
        self.registerHandler('/proxyDB/dist/[\\w]+', staticFileHandler.getFile);
        self.registerHandler('/proxyDB/all', proxyDBHandler.getAll);
        self.registerHandler('/proxyDB/update', proxyDBHandler.update);
        self.registerHandler('/proxyDB/insert', proxyDBHandler.insert);
        self.registerHandler('/proxyDB/delete\\?id=[\\w]+', proxyDBHandler.delete);
        self.registerHandler('^(?!\/proxyDB)', proxyDBHandler.serviceCallOrReplay);
        var _server = http.createServer(function (req, res) {
            self.dispatch(req, res);
        });

        console.log(colors.info("proxy server is running on %d..."), _port);
        _server.listen(_port);
    },
    dispatch: function(request, response){
        var url = request.url;
        for(var requestPath in this.handler){
            var regExp = new RegExp(requestPath);
            if(regExp.exec(url)){
                this.handler[requestPath](request, response);
                break;
            }
        }
    },
    handler:{},
    registerHandler: function(requestPath, handler){
        this.handler[requestPath] = handler;
    }
};