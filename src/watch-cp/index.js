var fs = require('fs-extra');
var colors = require('../utils/');

var WatchCP = {
	monitor : function(source, destination){
		console.log(colors.green('monitor is running...'));
		fs.watch(source, function(event, fileName){
			WatchCP._copy(source, destination);
		});
	},
	_copy : function(source, destination){
		fs.copy(source, destination, {clobber:true}, function (err) {
			if (err) {
				return false;
			}
			console.log(colors.green("synchronize files success!"));
		});
	}
};


module.exports = WatchCP;
