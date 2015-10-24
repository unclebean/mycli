var fs = require('fs-extra');
var colors = require('../utils/');

module.exports = {
	monitor : function(source, destination){
		console.log(colors.green('monitor is running...'));
		fs.watch(source, function(event, fileName){
			//console.log(colors.red.underline(event), colors.red.underline(fileName));
			fs.copy(source, destination, {clobber:true}, function (err) {
				if (err) {
					return false;
				}
				console.log(colors.green("success!"));
			});
		});
	}
};
