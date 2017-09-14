var colors = require('../utils/');
var Datastore = require('nedb');
var ResponseModel = require('./models/responseModel');

var proxyDBRepository = {
    init: function(){
        this.db = new Datastore({
            filename: './proxyDB'
        });
        this.db.loadDatabase(function (err) {});
    },
    loadAll: function(callback){
        this.db.find({}, function (err, records) {
            callback(err, records);
        });
    },
    removeById: function(id, callback){
        this.db.remove({
            _id: id
        }, {}, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    },
    updateById: function(responseModel, callback){
        this.db.update({_id: responseModel._id}, {
            '$set': {
                'responseData': responseModel.responseData,
                'responseHeaders': responseModel.responseHeaders,
                'payloadData': responseModel.payloadData
            }
        }, function (err, newRecord) {
            callback(err, newRecord);
        });
    },
    findByUrlAndPayload: function(responseModel, callback){
        var urlBase64 = new Buffer(responseModel.url).toString('base64'),
            payloadData = responseModel.payloadData || '',
            payloadBase64 = new Buffer(payloadData).toString('base64');
        
        this.db.findOne({
            "key": urlBase64,
            "payloadKey": payloadBase64 
        }, function (err, record) {
            callback(err, record);
        }); 
    },
    insertOrUpdate: function (responseModel, callback) {
        try{
            var payloadData = responseModel.payloadData || '';
            var _key = new Buffer(responseModel.url).toString('base64'),
                _payloadKey = new Buffer(payloadData).toString('base64');
            this.db.update({
                "key": _key,
                "payloadKey": _payloadKey
            }, {
                $set: {
                    "url": responseModel.url,
                    "responseData": responseModel.responseData,
                    "responseHeaders": responseModel.responseHeaders,
                    "payloadData": payloadData,
                    "payloadKey": _payloadKey
                }
            }, {
                upsert: true
            }, function (err, newReq) {
                try{
                    callback(err, newReq);
                }catch(e){
                    console.log(colors.error("error occur %s!", e));
                }
                if (err) {
                    console.log(colors.error("store request error %s!"), responseModel.requestURL);
                }
            });
        }catch(e){
            console.log(colors.error("store request error %s!"), e);
        }
    }
};

module.exports = proxyDBRepository;