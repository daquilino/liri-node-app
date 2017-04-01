/* Douglas Aquilino      April 2, 2017		liri.js

    LIRI is a command line node app that takes in parameters and gives back data.
LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and
Recognition Interface, LIRI is a Language Interpretation and Recognition Interface.
LIRI understands four command (see README.md for usage ) the user can use.  The 
commands can be used to get a movie's information from OMDB and Rotten Tommatoes, 
a song's information from Spotify,  display my last 20 tweets, or to run one of 
the previous commands using data from the random.txt file.  In addition to logging
the data the terminal/bash window, the data is also written to a .txt file 
called log.txt.
*/

//npm packages
const FS = require('fs');
const SPOTIFY = require("spotify");
const TWITTER = require('twitter');
const REQUEST = require('request');
const MOMENT = require('moment');
const CHEERIO = require('cheerio');

//module with API object keys
const KEYS = require("./keys.js");

//gets arguments after liri.js
let args = process.argv;

//'first argument' after 'node liri'
let command = args[2];

//'sescond argument' after 'node liri'
let argument = args[3];

//Call to initiate program
runLiri(command, argument);

//===========================================================================

//Runs proper 'command' function based on users argument(s).
//If command is not defined (understood by liri), the user is notified.
function runLiri(command, argument)
{
	writeToLog("\n==============================================================================");
	
	if(argument === undefined)
	{
		writeToLog("\n>$ node liri " + command + "\n");
	}
	else	
	{	
		writeToLog("\n>$ node liri " + command + " " +  argument + "\n");
	}	
	
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
	        let defaultMsg = "Sorry, Liri Didn't Understand Your Command. Try Again.";	
	        console.log("\n" + defaultMsg);
	        writeToLog(defaultMsg);

	}//END switch

}//END runLiri()


//===========================================================================

//Appends 'data' to log.txt file using 'file-system' npm package.  I used 
//'appendFileSync' so data is appended to file in order function is called,
//and not asynchronously.  *NOTE: There is no callback function for appendFileSync.
function writeToLog(data)
{
	FS.appendFileSync('log.txt', "\r\n" + data);

}//END writeToLog()


//===========================================================================

//Uses npm 'Twitter' package to query Twitter my tweets.
//Then displays the time and content for my last 20 tweets.
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
			let errorMsg = "Sorry, There Seems To Be A Problem With Twitter. Try Again.";
			console.log("\n" + errorMsg);
			writeToLog(errorMsg);
		}
		else
		{		    			
			console.log("\n* My Last 20 Tweets (Newest First) *\n");

			//Loops through last 20 'tweets' and displays them if they exist. 
		    for(let i = 0; i < 20; i++)
		    {		    	
		    	if(tweets[i] != undefined)
		    	{		    		
		    		let tweet = tweets[i].text;

		    		//Creates a moments.js time from tweet's 'created_at' time, and formats for display
		    		let tweetTime = MOMENT(tweets[i].created_at, "dd MMM DD HH.mm:ss ZZ YYYY")
		    			.format("MMMM Do YYYY h:mm A");	    		

		    		let tweetMsg = tweetTime + "\n" +"- '"+ tweet + "\n";
		    		console.log(tweetMsg);
		    		writeToLog(tweetMsg);	    		
		    	}		    			    	
			}
	  	}//END else
	});//END CLIENT.get

}//END twitterAPI()

//===========================================================================

//Uses npm 'Spotify' package to query Spotify for song from user argument.
//If no song argument is provided by user, 'The Sign' will be used as default.
//If found displays the songs 'Artist', 'Song Name', 'Preview URL', and 'Album' data. 
function spotifyAPI(song)
{		
	//Sets default if song is undefined.        
    if (song === undefined)
    {
    	song = "The Sign";
    }	

	SPOTIFY.search({ type: 'track', query: song }, function(err, data) {
	    //checks for error
	    if (err) {
	        let errorMsg = "Sorry, There Seems To Be A Problem With Spotify. Try Again.";
	        console.log("\n" + errorMsg);
	        writeToLog(errorMsg);
	        return;
	    }

		//Checks if any song information found.
		if(data.tracks.items.length !== 0)
		{
		    //String messeges for display
			let resultsMsg = "* Spotify Results For '" + song + "' *\n";
			let artistMsg = "Artist: " + data.tracks.items[0].artists[0].name;
			let songMsg = "Song Name: " + data.tracks.items[0].name ;
			let previewMsg = "Preview URL: " + data.tracks.items[0].preview_url; 
			let albumMsg = "Album: " + data.tracks.items[0].album.name;

			//array of string messeges
			let messages =[resultsMsg,artistMsg, songMsg, previewMsg, albumMsg];

			for(let key in messages)
			{
				console.log(messages[key]);
				writeToLog(messages[key]);
			}			    
		}
		else
		{
			let noResultsMsg = song +"' Found No Results!  Try Another Song."
			console.log(noResultsMsg);
			writeToLog(noResultsMsg);
		}
	});
}//END spotifyAPI()

//===========================================================================

//Uses npm 'request' package to query OMDB API for a movie from user argument.
//If no movie argument is provided by user, 'Mr. Nobody' will be used as default.
//If found displays the movie's 'Title', 'Year', 'IMDB Rating', 'Country', 'Language',
//'Plot', and 'Actors' data from OMDB.
//Next 'request' is used again with the movie 'Title' to query 'Rotten Tomatoes'.
//Then npm 'cheerio' package is used to 'scrape' 'Rotten Tomatoes' html 'body' response
//for the movies 'Rotten Tomato Rating' data. 
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
			let errorMsg = "Sorry, There Seems To Be A Problem With OMDB. Try Again.";
			console.log(errorMsg);
			writeToLog(errorMsg);
			return;
		}
			//stores movie 'body' data as object
			let movieData = JSON.parse(body);		

		//Checks if any movie information found.	
		if(movieData.Response === "False")
		{
			let errorMsg =  movie + "' Found No Results!  Try Another Title.";
			console.log(errorMsg);
			writeToLog(errorMsg);
		}	
		else
		{		
			let movieTitle = movieData.Title;
			
			 //String messeges for display
			let resultsMsg = "* OMDB Results For '" + movieTitle + "' *\n";
			let titleMsg = "Title: " + movieTitle;
			let yearMsg = "Year: " + movieData.Year;
			let imdbRatingMsg = "IMBD Rating: " + movieData.imdbRating;
			let countryMsg = "Country: " + movieData.Country;
			let languageMsg = "Language: " + movieData.Language;
			let plotMsg = "Plot: " + movieData.Plot
			let actorsMsg = "Actors: " + movieData.Actors;

			//array of string messeges
			let messages =[resultsMsg, titleMsg, yearMsg, imdbRatingMsg, countryMsg, languageMsg, plotMsg, actorsMsg];

			for(let key in messages)
			{
				console.log(messages[key]);
				writeToLog(messages[key]);
			}	
	 	
		 	//If movie title starts with 'The', 'The' is removed, and the title is trimed. 
		 	if(movieTitle.startsWith("The"))
		 	{
		 		movieTitle = movieTitle.replace("The" , "").trim();
		 	}	

		 	//The movie title is made lowercase.
		 	movieTitle= movieTitle.toLowerCase();

		 	//Replaces all non alpha-numeric characters except spaces with "", 
		 	//then replaces all 'white space' with an underscore. 
		 	//Example: 'mr. nobody' becomes 'mr_nobody'
		 	movieTitle = movieTitle.replace(/[^a-z,0-9,\s]/g, "").replace(/\s/g, "_");
	 	
		 	const ROTTON_TOMATOES_ENDPOINT = "https://www.rottentomatoes.com/m/";		
			let url = ROTTON_TOMATOES_ENDPOINT +  movieTitle;

		 	let rottenUrlMsg = "Rotten Tomatoes URL: " + url;
		 	console.log(rottenUrlMsg);
		 	writeToLog(rottenUrlMsg);

			//Scrapes 'Rotten Tomatoes' results page for movie rating.
			REQUEST(url, function (error, data, body) 
			{
				if(error)
				{
					let errorMsg = "Sorry, There Seems To Be A Problem With Rotten Tomatoes. Try Again.";
					console.log(errorMsg);
					writeToLog(errorMsg);
					return;
				}	

				//This loads in the html page (body) of Rotten Tomaotes from REQEST
				let $ = CHEERIO.load(body);

				//Saves JSON object that holds movie data from html file.
				//The object is inside the '<script>' tag with id 'jsonLdSchema'
				//in the rotten tomatoes html file ($). 
			    let dataObject = JSON.parse($("#jsonLdSchema").html());
	    
		    	//Checks if dataObject exists and movie rating property exists.
		    	if(dataObject != null && dataObject.aggregateRating != undefined)
		    	{	
			    	let rating = dataObject.aggregateRating.ratingValue;
				    
			    	//Checks if rating is a number (exists).
				    if(!isNaN(rating))
				    {	
				    	let errorMsg = "Rotten Tomatoes Rating: " + rating;
				    	console.log(errorMsg);
				    	writeToLog(errorMsg);
					}
					else
					{
						let noRatingMsg = "Rotten Tomatoes Rating: N/A";
						console.log(noRatingMsg);
						writeToLog(noRatingMsg);
					}
				}
				//When no Rotten Tomatoe results exist.
				else
				{
					let noRatingMsg = "Rotten Tomatoes Rating: N/A";
					console.log(noRatingMsg);
					writeToLog(noRatingMsg);
				}	

			});//END REQUEST
		}//END else
	});//END REQUEST

}//END omdbAPI()

//===========================================================================

// Reads liri arguments from 'random.txt' file.
// Then uses those arguments calling runLiri().
function doWhatItSays()
{
	FS.readFile('random.txt', "utf8", function(err, data)
	{ 
	  	if(err)
	  	{
	  		let errorMsg = "Sorry, There Was An Error Reading 'random.txt'.";
	  		console.log(errorMsg);
	  		writeToLog(errorMsg);
	  	}
	  	
	  	//Splits data string from random.txt by "," into array 'args'.
	  	//Sets 'command' and 'argument' from 'args' array.		  
	  	let args = data.split(",");
	  	let command = args[0];
	  	let argument = args[1];
	  	
	  	
	  	writeToLog("*Next Command Ran From 'Random.txt'");
	  	
	  	//Runs liri with 'command' and 'argument'.
	  	runLiri(command, argument);
 	});//END FS.readFile

}//END doWhatItSays()
