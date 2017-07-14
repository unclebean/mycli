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

module.exports = {
    startup: function (proxyOptions) {
        var self = this,
            _port = parseInt(proxyOptions.server.port) ? proxyOptions.server.port : 5555,
            _options = proxyOptions.target;
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
                            'responseHeaders': _responseHeaders
                        }
                    }, function (err, newRecord) {
                        res.writeHeader(200, {"Content-Type": "text/json"});
                        res.write(JSON.stringify({'status': 'success'}));
                        res.end();
                    });
                });
            } else if (_url.indexOf('/proxyDB/delete') > -1) {
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
                db.findOne({
                    "key": new Buffer(_url).toString('base64')
                }, function (err, record) {
                    if (proxyOptions.server.replay && record) {
                        console.log(colors.yellow("Request %s through local db."), _url);
                        res.headers = record.responseHeaders;
                        res.write(record.responseData);
                        res.end();
                        return true;
                    } else {
                        console.log(colors.debug("Request %s proxy calling."), _url);
                        if (req.method === 'POST') {
                            req.on('data', function (data) {
                                _temp = data;
                            });
                            req.on('end', function () {
                                _data = JSON.parse(_temp.toString());
                                self.performRequest(_proxyType, _options, _url, req.method, req.headers, _data, function (responseStr, headers) {
                                    self._insertOrUpdate(_url, responseStr, headers);
                                    for (var key in headers) {
                                        res.setHeader(key, headers[key]);
                                    }
                                    res.write(responseStr);
                                    res.end();
                                });
                            });
                        } else if (req.method === 'GET') {
                            _data = url.parse(req.url);
                            self.performRequest(_proxyType, _options, _url, req.method, req.headers, _data, function (responseStr, headers) {
                                self._insertOrUpdate(_url, responseStr, headers);
                                for (var key in headers) {
                                    res.setHeader(key, headers[key]);
                                }
                                res.write(responseStr);
                                res.end();
                            });
                        }
                    }
                });
            }
        });

        console.log(colors.info("proxy server is running on %d..."), _port);
        _server.listen(_port);
    },
    performRequest: function (proxyType, options, endpoint, method, requestHeaders, data, success) {
        var self = this,
            dataString = JSON.stringify(data);

        options.path = endpoint;
        options.method = method;
        options.headers = requestHeaders;
        options.headers.host = options.host;
        if ("HTTPS" === proxyType) {
            self._createHTTPSRequest(options, dataString, success);
        } else {
            self._createHTTPRequest(options, dataString, success);
        }
    },
    _createHTTPRequest: function (options, dataString, callback) {
        var req = http.request(options, function (res) {
            res.setEncoding('utf-8');
            var responseString = '';
            res.on('data', function (data) {
                responseString += data;
            });
            res.on('end', function () {
                callback(responseString, res.headers);
            });

        });
        if (options.method == 'POST') {
            req.write(dataString);
        } else {
            req.write('');
        }
        req.end();
    },
    _createHTTPSRequest: function (options, dataString, callback) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        options.agent = new https.Agent(options);
        var req = https.request(options, function (res) {
            res.setEncoding('utf-8');
            var responseString = '';
            res.on('data', function (data) {
                responseString += data;
            });
            res.on('end', function () {
                callback(responseString, res.headers);
            });
        });
        if (options.method == 'POST') {
            req.write(dataString);
        } else {
            req.write('');
        }
        req.end();
    },
    _insertOrUpdate: function (requestURL, responseStr, responseHeaders) {
        var _key = new Buffer(requestURL).toString('base64');
        db.update({
            "key": _key
        }, {
            $set: {
                "url": requestURL,
                "responseData": responseStr,
                "responseHeaders": responseHeaders
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