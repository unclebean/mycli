var https = require('https'),
    http = require('http');

module.exports = {
    performRequest: function (proxyType, options, endpoint, method, requestHeaders, data, success) {
        var self = this,
            dataString = data;//JSON.stringify(data);

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
                res.headers.statusCode = res.statusCode;
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
                res.headers.statusCode = res.statusCode;
                callback(responseString, res.headers);
            });
        });
        if (options.method == 'POST') {
            req.write(dataString);
        } else {
            req.write('');
        }
        req.end();
    }
};