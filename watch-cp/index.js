var fs = require('fs-extra');
var chokidar = require('chokidar');

module.exports = {
	monitor : function(source, destinations){
		console.log('monitor is running...');
		chokidar.watch(source).on('all', function(event, path) {
			console.log(event, path);
			fs.copy(source, destinations[0], {clobber:true}, function (err) {
				if (err) {
					return false;
					//return console.error(err);
				}
				console.log("success!");
			});
		});
	}
};