// var spotify = require('node-spotify-api');
var twitter = require('twitter');
var fs = require('fs');
var request = require('request');
var keys = require('./keys.js');

var command = process.argv[2];
var input = process.argv[3];


switch(command) {
	case "my-tweets": myTweets(); break;
	case "spotify-this-song": spotifyThisSong(input); break;
	case "movie-this": movieThis(); break;
	case "do-what-it-says": doWhatItSays(); break;
	default: console.log("Command not recognized!");
};

function myTweets() {
	var client = new twitter({
			consumer_key: keys.consumer_key,
			consumer_secret: keys.consumer_secret,
			access_token_key: keys.access_token_key,
			access_token_secret: keys.access_token_secret, 
		});

		params = {screen_name: 'honeyvanx'};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					console.log("++ @" + data[i].user.screen_name + ": " + data[i].text);
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
	});
}

function spotifyThisSong(input) {
	var Spotify = require('node-spotify-api');
 
	var spotify = new Spotify({ 
	  	id: 'a25af6714f484b8f8030ea6ee52ef724',
  	  	secret: '50674b01092841cbbfb29402ad021046'
	});

	if(!input) {
		input = "The Sign Ace of Base";
	}
		params = input;
		spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				var songInfo = data.tracks.items;
				if (songInfo[0] != undefined) {
					console.log("Artist: " + songInfo[0].artists[0].name);
					console.log("Song: " + songInfo[0].name);
					console.log("Album: " + songInfo[0].album.name);
					console.log("Preview: " + songInfo[0].preview_url)
					// log(spotifyResults); // calling log function
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
	});
}

function movieThis() {
	if (!input) {
		input = 'Mr. Nobody';
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {

		if (!error && response.statusCode === 200) {

	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Year: " + JSON.parse(body).Year);
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    console.log("RT Rating: " + JSON.parse(body).Ratings[1].Value);
	    console.log("Country: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors);
	    
	    
	  	}
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(err,data) {
		if (err) {
			return console.log(err);
		}
		var array = data.split(",");

		spotifyThisSong(array[1]);
	});
}