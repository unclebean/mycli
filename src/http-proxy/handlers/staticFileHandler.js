'use strict';
var fs = require('fs');
var path = require('path');

var staticFileHandler = {
    setRootPath: function(path){
        this.rootPath = path;
    },
    getIndexPage: function(request, response){
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(fs.readFileSync(staticFileHandler.rootPath + "/index.html", "utf8"));
        response.end();
    },
    getFile: function(request, response){
        var extname = path.extname(request.url);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }
        response.writeHeader(200, {"Content-Type": contentType});
        response.write(fs.readFileSync(staticFileHandler.rootPath + request.url.replace('/proxyDB', ''), "utf8"));
        response.end();
    }
};

module.exports = staticFileHandler;