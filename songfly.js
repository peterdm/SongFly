var myip = "127.0.0.1";
var myport = 8675;

var searchip = "107.22.133.4";
var searchport = 9300;
var searchmethod = "GET";
var searchpath = "/songfly_twitter_river/_search";

var http = require('http');
var sys = require('sys');
var url = require('url');
var server = http.createServer(function(req, res) {
   var partz = url.parse(req.url);
   if(partz.pathname == '/search' && partz.query != '') {
        res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.end(JSON.stringify(findPeepsJson(partz.query));
   }
});
server.listen(myport, myip);
console.log('Songfly server running at http://127.0.0.1:8675/');

function findPeepsJson(query) {
   var client = http:createClient(searchport, searchip); 
   var request = client.request(searchmethod, searchpath)

   // listening to the response is optional, I suppose
   request.on('response', function(response) {
      response.on('data', function(chunk) {
         // do what you do
      });
      response.on('end', function() {
         // do what you do
      });
   });

   var data = JSON.stringify({'q', 'text:'+query});
   request.write(data);

   request.end();
}
