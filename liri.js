const FS = require('fs');
const SPOTIFY = require("spotify");
const TWITTER = require('twitter');
const KEYS = require("./keys.js");
const REQUEST = require('request');
const MOMENT = require('moment');
const CHEERIO = require('cheerio');

//gets arguments after liri.js
let args = process.argv;

//'first argument' after 'node liri'
let command = args[2];

//'sescond argument' after 'node liri'
let argument = args[3];

//Calls 
runLiri(command, argument);


//Runs proper 'command' function based on users argument(s).
//If command is not defined (understood by liri), the user is notified.
function runLiri(command, argument)
{
	switch(command)
	{
		case "my-tweets":
	        twitterAPI();       
	        break;
	  	
	  	case "spotify-this-song":
	        spotifyAPI(argument);
	        break;
	    
	    case "movie-this":
	        omdbAPI(argument);
	        break;
	    
	    case "do-what-it-says":      
	        doWhatItSays();
	        break;
	    
	    default:
	        console.log("\nSorry, Liri Didn't Understand Your Command. Try Again.");

	}//END switch

}//END runLiri()


//===========================================================================

function writeToLog(data)
{
	FS.appendFile('log.txt', data + "\n", function (err) 
	{ 
	   	if (err)
	   	{	
	        console.log("Error saving to log.txt");
	    }
	});

}//END writeToLog()


//===========================================================================

function twitterAPI()
{

	const CLIENT = new TWITTER({
	  consumer_key: KEYS.twitterKeys.consumer_key,
	  consumer_secret: KEYS.twitterKeys.consumer_secret,
	  access_token_key: KEYS.twitterKeys.access_token_key,
	  access_token_secret: KEYS.twitterKeys.access_token_secret
	});
 
	const PARAMS = {screen_name: "thesoybeanjelly"};//NEED TO CHANGE TO MY TWITTER ACCOUNT

	CLIENT.get('statuses/user_timeline', PARAMS, function(error, tweets, response)
	{
		if(error)
		{
			console.log("\nSorry, There Seems To Be A Problem With Twitter. Try Again.");
		}
		else
		{		    			
			console.log("\n*** My Last 20 Tweets (Newest First) ***\n");

		    for(let i = 0; i < 20; i++)
		    {		    	
		    	if(tweets[i] != undefined)
		    	{	
		    		let tweet = tweets[i].text;
		    		let tweetTime = MOMENT(tweets[i].created_at, "dd MMM DD HH.mm:ss ZZ YYYY").format("MMMM Do YYYY h:mm A");	    		

		    		console.log(tweetTime + "\n" +"- '"+ tweet + "'\n");	    		
		    	}		    			    	
			}
	  	}
	});

}//END twitterAPI()

//===========================================================================


function spotifyAPI(song)
{		
	//Sets default if song is undefined.        
    if (song === undefined)
    {
    	song = "The Sign";
    }	

	SPOTIFY.search({ type: 'track', query: song }, function(err, data) {
	    if ( err ) {
	        console.log("\nSorry, There Seems To Be A Problem With Spotify. Try Again.");
	        return;
	    }
	 
	    console.log("\n*** Spotify Results For '" + song + "' ***");	    
	    console.log("Artist: " + data.tracks.items[0].artists[0].name);
	    console.log("Song Name: " + data.tracks.items[0].name);
	    console.log("Preview URL: " + data.tracks.items[0].preview_url);
	    console.log("Album: " + data.tracks.items[0].album.name);
	});
}//END spotifyAPI()

//===========================================================================


function omdbAPI(movie)
{
    //Sets default if movie is undefined.
    if (movie === undefined)
    {
    	movie = "Mr. Nobody";
    }
	
	const OMBD_ENDPOINT = "http://www.omdbapi.com/?";
	let url = OMBD_ENDPOINT + "t=" + movie;	

	//Data is in the 'body' as a string.
	REQUEST(url, function (error, response, body) 
	{
		if (error)
		{
			console.log("\nSorry, There Seems To Be A Problem With OMDB. Try Again.");
			return;
		}
			//stores movie 'body' data as object
			let movieData = JSON.parse(body);		


		if(movieData.Response === "False")
		{
			console.log("'" + movie +"' Not Found!  Try Another Title.");
		}	
		else
		{
			
			let movieTitle = movieData.Title;
			
			console.log("\n*** OMDB Results For '" + movieTitle + "' ***");
		 	console.log("Title: " + movieTitle);
		 	console.log("Year: " + movieData.Year);
		 	console.log("IMBD Rating: " + movieData.imdbRating);
		 	console.log("Country: " + movieData.Country);
		 	console.log("Language: " + movieData.Language);
		 	console.log("Plot: " + movieData.Plot);
		 	console.log("Actors: " + movieData.Actors);
		 	
		 	//If movie title starts with 'The', 'The' is removed, title is trimed, and made lowercase. 
		 	if(movieTitle.startsWith("The"))
		 	{
		 		movieTitle = movieTitle.replace("The" , "").trim().toLowerCase();
		 	}	

		 	//replaces all 'white space' with an underscore.
		 	movieTitle = movieTitle.replace(/\s/g, "_");
		 	
		 	//console.log("Rotten Tomatoes Rating: " + movieData.);// Depricated
		 	console.log("Rotten Tomatoes URL: " + "https://www.rottentomatoes.com/m/" + movieTitle);

		 	const ROTTON_TOMATOES_ENDPOINT = "https://www.rottentomatoes.com/m/";		
			let url = ROTTON_TOMATOES_ENDPOINT +  movieTitle;

			REQUEST(url, function (error, data, body) 
			{
				if(error)
				{
					console.log("error");
					return;
				}	

				//This loads in the html (body) from REQEST
				let $ = CHEERIO.load(body);

				//dataObject is the object inside the '<script>' tag of id jsonLdSchema
				//in the rotten tomatoes html file ($). 
			    let dataObject = JSON.parse($("#jsonLdSchema").html());
			    
			    let rating = dataObject.aggregateRating.ratingValue;

			    console.log("Rotten Tomatoes Rating: " + rating);

			});
		}
	});

}//END omdbAPI()

//===========================================================================

// Reads liri arguments from 'random.txt' file.
function doWhatItSays()
{
	FS.readFile('random.txt', "utf8", function(err, data)
	{ 
	  	if(err)
	  	{
	  		console.log("Sorry, There Was An Error Reading 'random.txt'.");
	  	}
	  	//Splits data string from random.txt by "," into array 'args'.
	  	//Sets 'command' and 'argument' from 'args' array.		  
	  	let args = data.split(",");
	  	let command = args[0];
	  	let argument = args[1];
	  	
	  	//Runs liri with 'command' and 'argument'.
	  	runLiri(command, argument);
 	});

}//END doWhatItSays()
