
/**
 * Module dependencies.
 */
var http = http = require('http');

var express = require('express')
  , routes = require('./routes')


var app = module.exports = express.createServer();

// Configuration
var elastic_options = {
	host: 'es.songfly.net',
	port: 9200,
	path: '/songfly_twitter_river/_search',
	method: 'POST'
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.get('/search', function(req, res){
	var message = "";
	var params = require('url').parse(req.url, true).query;
	console.log('SONG: ' + params['song'] + ', ARTIST: ' + params['artist']);
	
	res.render('search', {
		title: 'Search',
		song: params['song'],
		artist: params['artist']
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

