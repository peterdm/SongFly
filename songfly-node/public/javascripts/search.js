var searchURL = 'http://es.songfly.net:9200/songfly_twitter_river/_search?callback=?';

function searchQuery(song, artist) {
	
	var field_to_search = "text";
	
	// Boost params for promoting recent results
	var params = {};
	params.a = 0.08;
	params.b = 0.05;
	params.m = 0.000000000316;

	var script = "_score * (a / (m * (new Date().getTime() - doc['created_at'].getValue()) + b ) )";
	var mustQ = {};
	mustQ["text"] = {};
	mustQ["text"][field_to_search] = { "query" : song, "type": "phrase", "slop" : 1 };
	
	var shouldQ = {};
	shouldQ["text"] = {};
	shouldQ["text"][field_to_search] = { "query" : artist, "type" : "phrase", "slop" : 1 }; 
	
	var cs_query = {};
	cs_query["query"] = {};
	cs_query["query"]["bool"] = { "must" : mustQ, "should" : shouldQ, "boost" : 1.0 };
	cs_query["params"] = params;
	cs_query["script"] = script;
	
	var query = {};
	query["custom_score"] = cs_query;
	
	var source = {};
	source["from"] = 0;
	source["size"] = 3;
	source["fields"] = [ "user.name", "user.screen_name", "created_at", "text", "user.description" ];
	source["query"] = query;
	
	return JSON.stringify(source);
}


$(window).load( bindSubmit() );
$(window).load( lookup() ); 
	
function lookup() {
	var song = $('input[name=song]').val();
	var artist = $('input[name=artist]').val();
	console.log(searchQuery(song, artist));
	$.getJSON(searchURL, {  
				"source" : searchQuery(song, artist)
			 }, function(data) {
				console.log(data);
				var items = [];
				if (data.hits.total > 0) {
					console.log(data.hits.total + " Hits!");
					$.each(data.hits.hits, function(key, val) {
						items.push('<li id="' + val.fields['user.screen_name'] + '"><div class="pic"><img src="http://api.twitter.com/1/users/profile_image?screen_name=' + val.fields['user.screen_name'] + '&size=bigger"/></div><div class="name">' + val.fields['user.name'] + '</div></li>');
					});
					console.log(items);
				
					$('<ul/>', {
						'class' : 'fan-list',
						html: items.join('')
					}).appendTo('div#fans');
				}});
}

function bindSubmit() {
	$('input.submit').click( function() {
		lookup();
	});
}