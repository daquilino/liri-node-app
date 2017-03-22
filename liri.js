var fs = require('fs');

var keys = require("./keys.js");

//gets argument (command) after liri.js
var args = process.argv;
var command = args[2];
var argument = args[3]

liriLogic(command, argument);

function liriLogic(command, argument)
{

	switch(command)
	{
		case "my-tweets":
	        //code block
	       
	        break;
	  	
	  	case "spotify-this-song":
	        
	        var song = argument;
	    console.log(command +" " + song);
			//Sets default if song is undefined.        
	        if (song === undefined)
	        {
	        	song = "The Sign";

	        }	

	        break;
	    
	    case "movie-this":
	        var movie = argument;

	        //Sets default if movie is undefined.
	        if (movie === undefined)
	        {
	        	movie = "Mr. Nobody";
	        }

	        var request = require('request');
			
			const OMBD_ENDPOINT = "http://www.omdbapi.com/?";

			var url = OMBD_ENDPOINT + "t=" + movie;	

			//Data is in the 'body' as a string.
			request(url, function (error, response, body) 
			{
				if (error)
				{
					console.log("error: " + error);
				}

				//stores the movie data as object.
				var movieData = JSON.parse(body);

			 	console.log("Title: " + movieData.Title);
			 	console.log("Year: " + movieData.Year);
			 	console.log("IMBD Rating: " + movieData.imdbRating);
			 	console.log("Country: " + movieData.Country);
			 	console.log("Language: " + movieData.Language);
			 	console.log("Plot: " + movieData.Plot);
			 	console.log("Actors: " + movieData.Actors);
			 	// //console.log("Rotten Tomatoes Rating: " + movieData.);
			 	// //console.log("Rotten Tomatoes URL: " + movieData.);
			});
        
	        break;
	    
	    case "do-what-it-says":
	        fs.readFile('random.txt', function(err, data)
			{ 
			  	if(err)
			  	{
			  		console.log(err);
			  	}
			  	
			  	var x = data.toString();
			  	args = x.split(",");
			  	
			  	liriLogic(args[0], args[1]);

		 	});
	        
	        break;
	    
	    default:
	        console.log("Sorry, Liri Didn't Understand Your Command. Try Again.");

	}//END switch

}//END liriLogic


//====================================================================================
/*--------------------- NOTES -------------------------------------------*/
// this crates a file and adds aaa to it.
//fs.writeFile('test.txt', 'aaa', function(err) {});



function writeToLog(data)
{
	fs.appendFile('log.txt', "\n" + data, function (err) { 
	    if (err)
	        console.log(err);
	    else
	        console.log('Append operation complete.');
	});

}//END writeToLog