'use strict';

function RequestModel(proxyType, targetHostConfig, url, requestType, requestHeaders, payloadData){
    this.setProxyType(proxyType);
    this.setTargetHostConfig(targetHostConfig);
    this.setUrl(url);
    this.setRequestType(requestType);
    this.setRequestHeaders(requestHeaders);
    this.setPayloadData(payloadData);
}

RequestModel.prototype = {
    setProxyType: function(proxyType){
        this.proxyType = proxyType;
    },
    setTargetHostConfig: function(targetHostConfig){
        this.targetHostConfig = targetHostConfig;
    },
    setUrl: function(url){
        this.url = url;
    },
    setRequestType: function(requestType){
        this.requestType = requestType;
    },
    setRequestHeaders: function(requestHeaders){
        this.requestHeaders = requestHeaders;
    },
    setPayloadData: function(payloadData){
        this.payloadData = payloadData;
    }
};

module.exports = RequestModel;