var es = require('event-stream'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError,
	jsesc = require('jsesc'),
	cheerio = require('cheerio'),
	concat = require('gulp-concat'),
	header = require('gulp-header'),
	footer = require('gulp-footer');

var TEMPLATE_HEADER = 'angular.module(\'<%= module %>\').run([\'$templateCache\', function($templateCache) {';
var TEMPLATE_FOOTER = '}]);';

var DEFAULT_BUNDLENAME = 'templatecache.js';
var DEFAULT_MODULE = 'templates';

/**
 * Add files to templateCache
 */
function ngTemplateCacheFile(file, callback){
	var fileContent = file.contents.toString('utf-8'),
		$ = cheerio.load('<div id="document">' + fileContent + '</div>'),
		$content = $("#document").children();
	if ($content.length == 1 && $content[0].type == "script" && $content[0].attribs.type == "text/ng-template") {
		var newFile = file.clone();
		newFile.contents = new Buffer('$templateCache.put(' + $content[0].attribs.id + ',\'' + jsesc($("#document script").eq(0).html()) + '\');');
		callback(null, newFile);
	} else {
		callback(new PluginError('gulp-ng-template-cache', 'The file is not ng-template: ' + file.path));
	}
}

/**
 * process stream of files
 */
function ngTemplateCacheStream(){
	return es.map(ngTemplateCacheFile);
}

/**
 * Concatenates and register ng-templates from <script type="text/ng-template"> in the $templateCache
 * @param {object} [options]
 */
function ngTemplateCache(options){
	options = options || {};

	var bundleName = options.bundleName || DEFAULT_BUNDLENAME;

	return es.pipeline(
		ngTemplateCacheStream(),
		concat(bundleName),
		header(TEMPLATE_HEADER, {
			module: options.moduleName || DEFAULT_MODULE
		}),
		footer(TEMPLATE_FOOTER));
}

/**
 * Expose ngTemplateCache
 */
module.exports = ngTemplateCache;