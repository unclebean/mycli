var https = require('https'),
    http = require('http');
var RequestModel = require('./models/requestModel');

module.exports = {
    performRequest: function (requestModel, success) {
        try{
            var self = this,
            dataString = requestModel.payloadData;//JSON.stringify(data);
            var options = requestModel.targetHostConfig;
            options.path = requestModel.url;
            options.method = requestModel.requestType;
            options.headers = requestModel.requestHeaders;
            options.headers.host = requestModel.targetHostConfig.host;
            if ("HTTPS" === requestModel.proxyType) {
                self._createHTTPSRequest(options, dataString, success);
            } else {
                self._createHTTPRequest(options, dataString, success);
            }
        }catch(e){
            console.log(e);
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
        if (options.method !== 'GET') {
            req.write(dataString || '');
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
        if (options.method !== 'GET') {
            req.write(dataString || '');
        } else {
            req.write('');
        }
        req.end();
    }
};