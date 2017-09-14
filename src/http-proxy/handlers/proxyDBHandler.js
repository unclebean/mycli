'use strict';
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var colors = require('../../utils/');
var httpClient = require('../httpClient');
var RequestModel = require('../models/requestModel');
var ResponseModel = require('../models/responseModel');
var proxyDBRepository = require('../proxyDBRepository');

var proxyDBHandler = {
    init: function(proxyOptions){
        var _options = proxyOptions.target,
            _whitelist = _options.whitelist || [];
        var _proxyType = proxyOptions.server.proxyType ? proxyOptions.server.proxyType : "HTTP";
        try {
            _options.key = fs.readFileSync(_options.key, 'utf8');
            _options.cert = fs.readFileSync(_options.cert, 'utf8');
        } catch (e) {
        }
        this.proxyOptions = proxyOptions;
        this.options = _options;
        this.proxyType = _proxyType;
        this.whitelist = _whitelist;
    },
    getAll: function(request, response){
        proxyDBRepository.loadAll(function(err, records){
            response.writeHeader(200, {"Content-Type": "text/json"});
            response.write(JSON.stringify(records));
            response.end();
        });
    },
    update: function(request, response){
        var _data = null, _temp = [];
        request.on('data', function (data) {
            _temp.push(data);
        });
        request.on('end', function () {
            var _data = querystring.parse(_temp.join(''));
            var responseModel = new ResponseModel();
            responseModel.setId(_data._id);
            responseModel.setResponseHeaders(_data.responseHeaders);    
            responseModel.setResponseData(_data.responseData);
            responseModel.setPayloadData(_data.payloadData);
            proxyDBRepository.updateById(responseModel, function(err, newRecord){
                response.writeHead(302, {'Location': '/proxyDB'});
                response.end();
            });
        });
    },
    insert: function(request, response){
        var _data = null, _temp = [];
        request.on('data', function(data){_temp.push(data);});
        request.on('end', function(){
            var _data = querystring.parse(_temp.join(''));
            var responseModel = new ResponseModel();
            responseModel.setUrl(_data.url);
            responseModel.setResponseHeaders(_data.responseHeaders);    
            responseModel.setResponseData(_data.responseData);
            responseModel.setPayloadData(_data.payloadData);
            proxyDBRepository.insertOrUpdate(responseModel, function(){
                response.writeHead(302, {'Location': '/proxyDB'});
                response.end();
            });
        });
    },
    delete: function(request, response){
        var _data = null;
        _data = url.parse(request.url, true);
        proxyDBRepository.removeById(_data.query.id, function(err, numRemoved){
            response.writeHead(302, {'Location': '/proxyDB'});
            response.end();
        });
    },
    serviceCallOrReplay: function(request, response){
        var _data = null, _temp = [];
        if (request.method === 'POST') {
            request.on('data', function (data) {
                _temp = data;
            });
            request.on('end', function () {
                proxyDBHandler.tryToReplay(request, response, _temp);
            });
        } else if (request.method === 'GET') {
            proxyDBHandler.tryToReplay(request, response);
        }
    },
    tryToReplay: function(request, response, payloadBuffer){
        var url = request.url;
        payloadBuffer = payloadBuffer || new Buffer('');
        var responseModel = new ResponseModel();
        responseModel.setUrl(request.url);
        responseModel.setPayloadData(payloadBuffer.toString()); 
        proxyDBRepository.findByUrlAndPayload(responseModel, function(err, record){
            if (proxyDBHandler.proxyOptions.server.replay && record && proxyDBHandler.isCacheEnabledURL(url)) {
                proxyDBHandler.replayWithRecord(url, record, response);
            }else{
                var requestModel = new RequestModel();
                requestModel.setProxyType(proxyDBHandler.proxyType);
                requestModel.setTargetHostConfig(proxyDBHandler.options);
                requestModel.setUrl(url);
                requestModel.setRequestType(request.method);
                requestModel.setRequestHeaders(request.headers);
                requestModel.setPayloadData(payloadBuffer.toString());
                httpClient.performRequest(requestModel, function(responseStr, headers){
                    proxyDBHandler.recordResponse(url, payloadBuffer, response, responseStr, headers);
                });
            }

        });
    },
    replayWithRecord: function(url, record, response){
        console.log(colors.yellow("Request %s through local db."), url);
        response.headers = record.responseHeaders;
        response.statusCode = record.responseHeaders.statusCode || 200;
        response.write(record.responseData);
        response.end();
    },
    recordResponse: function(url, payloadBuffer, response, responseStr, headers){
        if(proxyDBHandler.isCacheEnabledURL(url)){
            var responseModel = new ResponseModel();
            responseModel.setUrl(url);
            responseModel.setResponseData(responseStr);
            responseModel.setResponseHeaders(headers);
            responseModel.setPayloadData(payloadBuffer.toString());
            proxyDBRepository.insertOrUpdate(responseModel, function(){});
        }
        for (var key in headers) {
            response.setHeader(key, headers[key]);
        }
        response.statusCode = headers.statusCode || 200;
        response.write(responseStr);
        response.end();
    },
    isCacheEnabledURL: function(url){
        return proxyDBHandler.whitelist.indexOf(url) === -1;
    }
};

module.exports = proxyDBHandler;