var https = require('https'),
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    zlib = require('zlib'),
    querystring = require('querystring'),
    path = require('path');
var Datastore = require('nedb'),
    db = new Datastore({
        filename: './proxyDB'
    });
db.loadDatabase(function (err) {
});
var colors = require('../utils/');
var httpClient = require('./httpClient');

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
        var _server = http.createServer(function (req, res) {
            var _data = null,
                _temp = [],
                _url = req.url;
            if ('/proxyDB' === _url) {
                res.writeHeader(200, {"Content-Type": "text/html"});
                res.write(fs.readFileSync(__dirname + "/index.html", "utf8"));
                res.end();
            } else if ('/proxyDB/all' === _url) {
                db.find({}, function (err, records) {
                    res.writeHeader(200, {"Content-Type": "text/json"});
                    res.write(JSON.stringify(records));
                    res.end();
                });
            } else if ('/proxyDB/update' === _url) {
                req.on('data', function (data) {
                    _temp.push(data);
                });
                req.on('end', function () {
                    var _data = querystring.parse(_temp.join('')),
                        _responseHeaders = _data.responseHeaders;
                    try {
                        _responseHeaders = JSON.parse(_responseHeaders)
                    } catch (e) {
                    }
                    db.update({_id: _data._id}, {
                        '$set': {
                            'responseData': _data.responseData,
                            'responseHeaders': _responseHeaders,
                            'payloadData': _data.payloadData
                        }
                    }, function (err, newRecord) {
                        res.writeHead(302, {'Location': '/proxyDB'});
                        res.end();
                    });
                });
            } else if('/proxyDB/insert' === _url){
                req.on('data', function(data){_temp.push(data);});
                req.on('end', function(){
                    var _data = querystring.parse(_temp.join('')),
                        _responseHeaders = _data.responseHeaders;
                    try {
                        _responseHeaders = JSON.parse(_responseHeaders)
                    } catch (e) {
                    }
                    self._insertOrUpdate(_data.url, _data.responseData, _responseHeaders, _data.payloadData);
                    res.writeHead(302, {'Location': '/proxyDB'});
                    res.end();
                });
            }else if (_url.indexOf('/proxyDB/delete') > -1) {
                _data = url.parse(req.url, true);
                db.remove({
                    _id: _data.query.id
                }, {}, function (err, numRemoved) {
                    res.writeHead(302, {'Location': '/proxyDB'});
                    res.end();
                });
            } else if (_url.indexOf('/dist/') > -1) {
                var extname = path.extname(_url);
                var contentType = 'text/html';
                switch (extname) {
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                }
                res.writeHeader(200, {"Content-Type": contentType});
                res.write(fs.readFileSync(__dirname + _url, "utf8"));
                res.end();
            } else {
                function updateDB(payloadBuffer){
                    db.findOne({
                        "key": new Buffer(_url).toString('base64'),
                        "payloadKey": payloadBuffer.toString('base64')
                    }, function (err, record) {
                        var isCacheEnabledURL = _whitelist.indexOf(_url) === -1;
                        if (proxyOptions.server.replay && record && isCacheEnabledURL) {
                            console.log(colors.yellow("Request %s through local db."), _url);
                            res.headers = record.responseHeaders;
                            res.statusCode = record.responseHeaders.statusCode || 200;
                            res.write(record.responseData);
                            res.end();
                            return true;
                        } else {
                            console.log(colors.debug("Request %s proxy calling."), _url);
                            httpClient.performRequest(_proxyType, _options, _url, req.method, req.headers, payloadBuffer.toString(), function (responseStr, headers) {
                                if(isCacheEnabledURL){
                                    self._insertOrUpdate(_url, responseStr, headers, payloadBuffer.toString());
                                }
                                for (var key in headers) {
                                    res.setHeader(key, headers[key]);
                                }
                                res.statusCode = headers.statusCode || 200;
                                res.write(responseStr);
                                res.end();
                            });

                        }
                    }); 
                }
                if (req.method === 'POST') {
                    req.on('data', function (data) {
                        _temp = data;
                    });
                    req.on('end', function () {
                        updateDB(_temp);
                    });
                } else if (req.method === 'GET') {
                    // var data = url.parse(req.url);
                    updateDB(new Buffer(''));
                }
                
            }
        });

        console.log(colors.info("proxy server is running on %d..."), _port);
        _server.listen(_port);
    },
    _insertOrUpdate: function (requestURL, responseStr, responseHeaders, payloadData) {
        payloadData = payloadData || '';
        var _key = new Buffer(requestURL).toString('base64');
        db.update({
            "key": _key
        }, {
            $set: {
                "url": requestURL,
                "responseData": responseStr,
                "responseHeaders": responseHeaders,
                "payloadData": payloadData,
                "payloadKey": new Buffer(payloadData).toString('base64')
            }
        }, {
            upsert: true
        }, function (err, newReq) {
            if (err) {
                console.log(colors.error("store request error %s!"), requestURL);
            }
        });
    }
};