# liri

 LIRI is a command line node app that takes in parameters and gives back data.  LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface.  LIRI understands four command (see usage below) the user can use.  The commands can be used to get a movie's information from OMDB and Rotten Tommatoes, a song's information from Spotify, display my last 20 tweets, or to run one of the previous commands using data from the random.txt file.   In addition to logging the data the terminal/bash window, the data is also written to a .txt file called log.txt.   

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org) 


### Installing

1. Download and install Node.js (if not installed already). 
[Node.js Download Page](https://nodejs.org/en/download/)

2. Clone liri-node-app repository. 

```
$ git clone https://github.com/daquilino/liri-node-app
```

3. Within cloned repository run the following to install npm packages.

```
$ npm install
```


## Usage
#### Liri takes the following four commands as arguments.

1. `my-tweets`
 
```
$ node liri.js my-tweets 
```

   * Displays my last 20 tweets in your terminal/bash window.

2. `spotify-this-song` 

```
$ node liri.js spotify-this <"song title here">
```

   * This will show the following information about the song in your terminal/bash window
     
	  ```
      * Artist(s)
      * The song's name
      * A preview link of the song from Spotify
      * The album that the song is from
	  ```
    * if no song is provided then your program will default to
      * "The Sign" by Ace of Base


3. `movie-this`

```
$ node liri.js movie-this <"movie title here">
```
   * This will output the following information to your terminal/bash window:

     ```
     * Title of the movie.
     * Year the movie came out.
     * IMDB Rating of the movie.
     * Country where the movie was produced.
     * Language of the movie.
     * Plot of the movie.
     * Actors in the movie.
     * Rotten Tomatoes URL.
     * Rotten Tomatoes Rating.
     ```
   * if no movie is provided then your program will default to
     * "Mr. Nobody" 	



4. `do-what-it-says`

```
$ node liri.js do-what-it-says
```
   * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.


## Built With

* [Sublime Text](https://www.sublimetext.com/) - Text Editor.

###### NPM Packages
* [twitter](https://www.npmjs.com/package/twitter) - Library for Twitter API. 
* [spotify](https://www.npmjs.com/package/spotify)	- Library for Spotify API.
* [request](https://www.npmjs.com/package/request)	- Library used to make http calls.
* [file-system](https://www.npmjs.com/package/file-system)	- Library to read/write data in a file.
* [moment](https://www.npmjs.com/package/moment)	- A JavaScript date library.
* [cheerio](https://www.npmjs.com/package/cheerio) - Implementation of core jQuery for the server.



## Author

* **Douglas Aquilino** - [https://github.com/daquilino](https://github.com/daquilino)


