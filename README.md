# liri

 LIRI is a command line node app that takes in parameters and gives you back data.  LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface.  LIRI understands four command (see usage below) the user can use to get a movie's informationn from OMDB and Rotten Tommatoes, a song's information from Spotify, to see my last 20 tweets, or to run one of the previous commands using data from the random.txt file.   

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
liri takes the following four commands as arguments.

* `my-tweets`
  * Displays my last 20 tweets.
  ```
  $ node liri.js my-tweets
  ```

* spotify-this-song - 
```
$ node liri.js spotify-this <"song title here">
```
* movie-this
```
$ node liri.js movie-this <"movie title here">
```
* do-what-it-says
```
$ node liri.js do-what-it-says
```


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


