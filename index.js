var es = require('event-stream'),
	gutil = require('gulp-util'),
	jsesc = require('jsesc'),
	cheerio = require('cheerio');

var BUNDLENAME = 'templatecache.js';

module.exports = function(options){
	options = options || {};

	var bundlename = options.filename || BUNDLENAME;

	function ngTemplateCacheFile(file, callback){
		var fileContent = file.contents.toString('utf-8'),
			$ = cheerio.load('<div id="document">' + fileContent + '</div>'),
			$content = $("#document").children();
		if ($content.length == 1 && $content[0].type == "script" && $content[0].attribs.type == "text/ng-template") {
			var newFile = file.clone();
			console.log($content[0].attribs.id);
			newFile.contents = new Buffer('$templateCache.put(\'' + $content[0].attribs.id + '\',\'' + jsesc($("#document script").eq(0).html()) + '\');');
			callback(null, newFile);
		} else {
			this.emit('error', new PluginError('gulp-ng-template-cache', 'The file is not ng-template: ' + file.path));
			return callback();
		}
	}

	function ngTemplateCacheStream(){
		return es.map(ngTemplateCacheFile);
	}

	return es.pipeline(
		ngTemplateCacheStream(),
		concat(bundlename));
};