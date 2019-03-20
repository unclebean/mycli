var https = require('https'),
    http = require('http');
var RequestModel = require('./models/requestModel');
var zlib = require("zlib");

function gunzipRespHandler(response, callback) {
    var gunzip = zlib.createGunzip();
    response.pipe(gunzip);
    var respData = '';
    gunzip.on('data', function(data) {
        respData += data.toString();
    }).on("end", function() {
        response.headers.statusCode = response.statusCode;
        zlib.gzip(respData, function(error, data) {
            if(error){
                callback(error);
            } else {
                callback(data.toString(), response.headers);
            }
        });
    }).on("error", function(e) {
        callback(e);
    });
}

function respHandler(response, callback) {
    response.setEncoding('utf-8');
    var responseString = '';
    response.on('data', function (data) {
        responseString += data;
    });
    response.on('end', function () {
        response.headers.statusCode = response.statusCode;
        callback(responseString, response.headers);
    });
}

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
            if(res.headers['content-encoding'] === 'gzip') {
                gunzipRespHandler(res, callback);
            } else {
                respHandler(res, callback);
            }
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
            if(res.headers['content-encoding'] === 'gzip') {
                gunzipRespHandler(res, callback);
            } else {
                respHandler(res, callback);
            }
        });
        if (options.method !== 'GET') {
            req.write(dataString || '');
        } else {
            req.write('');
        }
        req.end();
    }
};
