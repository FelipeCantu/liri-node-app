require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require("moment");
var botCommand = process.argv[2];
var botSearch = process.argv.slice(3).join(" ");


function liriBot(botCommand, botSearch) {
    switch(botCommand) {
        case "do-what-it-says": onRandom();
            break;
        case "movie-this": onOMDB(botSearch);
            break;
        case "concert-this": onBandsInTown(botSearch);
            break;
        case "spotify-this-song": onSpotify(botSearch);
            break;
        default: 
            console.log("Please enter one of the Commands: 'spotify-this-song', 'concert-this', 'movie-this', 'do-what-it-says' to start");
    }
}

function onSpotify(nameSong) {
    var songName = botSearch;
    if (!songName) {
        songName = "\"The Sign\" by Ace of Base";
    };

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);       
        console.log("The song's name: " + data.tracks.items[0].name);
        console.log("A preview link of the song from Spotify: " + data.tracks.items[0].href);
        console.log("The album that the song is from: " + data.tracks.items[0].album.name);

        var appendSong = 
        "Artist(s): " + data.tracks.items[0].album.artists[0].name + "\nThe song's name: "
        + data.tracks.items[0].name + "\nA preview link of the song from Spotify: " + data.tracks.items[0].href + "\nThe album that the song is from: "
        + data.tracks.items[0].album.name;

        fs.appendFile("log.txt", appendSong, function (err) {
            if (err) throw err;
        });
    });
};


function onBandsInTown(artist) {
    var artist = botSearch;
    var bandQueryURL = ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp");

    axios.get(bandQueryURL)
    .then(function(response) {
        console.log("Name of the venue: " + response.data[0].venue.name);
        console.log("Venue location: " + response.data[0].venue.city);
        console.log("Date of the Event: " + moment(response.data[0].datetime).format("MM-DD-YYYY"));

        var appendShow = 
        "Musician: " + artist + "\nName of the venue: " + response.data[0].venue.name +
        "\nVenue location: " + response.data[0].venue.city + "\nDate of the Event: " + moment(response.data[0].datetime).format("\nMM-DD-YYYY");

        fs.appendFile("log.txt", appendShow, function(err) {
            if(err) throw err;
        })
    })
}


function onOMDB(movie) {
    if(!movie) {
        movie = "Mr.Nobody";
    }

    var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.request(movieQueryURL)
    .then( function(response) {
        console.log("* Title of the movie:" + response.data.Title);
        console.log("* Year the movie came out:" + response.data.Year);
        console.log("* IMDB Rating of the movie:" +response.data.imdbRating);
        console.log("* Rotten Tomatoes Rating of the movie:" + response.data.Ratings[1].Value);
        console.log("* Country where the movie was produced:" + response.data.Country);
        console.log("* Language of the movie:" + response.data.language);
        console.log("* Plot of the movie:" + response.data.Plot);
        console.log("* Actors in the movie:" + response.data.Actors);

        var appendMovie = 
        "* Title of the movie: " + response.data.Title + "\n* Year the movie came out: " + response.data.Year + "\n* IMDB Rating of the movie: "
        + response.data.imdbRating + "\n* Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value + "\n* Country where the movie was produced: "
        + response.data.Country + "\n* Language of the movie:" + response.data.Language + "\n* Plot of the movie: " + response.data.Plot + "\n* Actors in the movie: " 
        + response.data.Actors;


        fs.appendFile("log.txt", appendMovie, function(err) {
            if(err) throw err;
        })
    })
}

function onRandom() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        else {
            console.log(data);
            var dataArr = data.split(",");
            liriBot(dataArr[0], dataArr[1]);
        }
    })
}

function appendResults(data) {
    fs.appendFile("log.txt", data, function(err) {
        if(err) throw err;
    })
}

appendResults();

liriBot(botCommand, botSearch);
