'use strict';

function ResponseModel(id, url, type, payloadData, responseHeaders, responseData){
    this.setId(id);
    this.setUrl(url);
    this.setType(type);
    this.setPayloadData(payloadData);
    this.setResponseData(responseData);
    this.setResponseHeaders(responseHeaders);
}

ResponseModel.prototype = {
    setId: function(id){
        this._id = id;
    },
    setUrl: function(url){
        this.url = url;
    },
    setType: function(type){
        this.type = type;
    },
    setPayloadData: function(payloadData){
        this.payloadData = payloadData;
    },
    setResponseHeaders: function(responseHeaders){
        if(typeof responseHeaders === 'string' || responseHeaders instanceof String){
            this.responseHeaders = JSON.parse(responseHeaders);
        }else{
            this.responseHeaders = responseHeaders;
        }
    },
    setResponseData: function(responseData){
        this.responseData = responseData === 'null' ? '' : responseData;
    }

};

module.exports = ResponseModel;