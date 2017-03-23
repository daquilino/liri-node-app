const TWITTER = require('twitter');
const KEYS = require('./keys.js');
const FS = require('fs');

 
var client = new TWITTER({
  consumer_key: KEYS.twitterKeys.consumer_key,
  consumer_secret: KEYS.twitterKeys.consumer_secret,
  access_token_key: KEYS.twitterKeys.access_token_key,
  access_token_secret: KEYS.twitterKeys.access_token_secret
});
 
var params = {screen_name: screen_name};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    //console.log(tweets);

    //FS.appendFile("twitter.txt", JSON.stringify(tweets));

    var tweetarray = tweets;
    for(var i = 0; i < 20; i++)
    {	
    	console.log(tweets[i].text);
    	FS.appendFile(params.screen_name + ".txt", i + ".) " + tweets[i].text + "\n\n");
	}
  }
});