const SPOTIFY = require("SPOTIFY");

 
SPOTIFY.search({ type: 'track', query: 'smells like teen spirit' }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    //console.log(data.tracks.items[0]);//entire object
    
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Preview URL: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);
});