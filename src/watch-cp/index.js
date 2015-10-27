var fs = require('fs-extra');
var async = require('async');
var colors = require('../utils/');

var WatchCP = {
	monitor : function(source, destination){
		console.log(colors.green('monitor is running...'));
		var q = async.queue(function (action, callback) {
				WatchCP._copy(action.src, action.des);
				callback();
		}, 1);
		fs.watch(source, {recursive: true}, function(event, fileName){
			q.push({"src": source+'/'+fileName, "des":destination+'/'+fileName}, function (err) {});
		});
	},
	_copy : function(source, destination){
		fs.copy(source, destination, {clobber:true}, function (err) {
			if (err) {
				console.log(colors.red("synchronize %s failed!"), source);
				return false;
			}
			console.log(colors.green("synchronize %s success!"), source);
		});
	}
};


module.exports = WatchCP;
