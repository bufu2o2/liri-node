require("dotenv").config();
const i = require("inquirer");
const mo = require("moment");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const fs = require("fs");
const hr = "======================================================================";
const br = "\n\n";
const cl = (m) => {
    console.log(m);
}
const ct = (m) => {
    console.table(m);
}


let event = (artist) => {
    fs.appendFile("log.txt", "\nSearched for the concert of: " + artist, (e) => {
        if(e) throw e;
        cl(br + "           Searching . . . " + br + br);
    });
    let URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(URL).then((r) => {
        let x;
        if(r.data.length < 10){
            x = r.data.length;
        }
        else{
            x = 10;
        }
        if(r.data.length === 0){
            cl(br + artist + " doesn't have any upcoming concerts" + br + hr + br);
        }
        else{
            for(let i = 0; i<x; i++){
                ct(r.data[i].venue);
                cl("Event Date: " + mo(r.data[i].datetime).format('MMMM Do YYYY, h:mm:ss a') + "\n\n");
            }
        }
        
    });    
}

let search = (q) => {
    fs.appendFile("log.txt", "\nSearched for the song titled: " + q, (e) => {
        if(e) throw e;
        cl(br + "           Searching . . . " + br + br);
    });
    spotify.search({
    type: "track", query: q
}).then((r) => {
    let link = r.tracks.items[0];
    let artist = link.album.artists[0].name;
    let name = link.name;
    let spotify = link.album.artists[0].external_urls.spotify;
    let album = link.album.name;
   
    let Category = ["Artist(s)", "Song Name", "Link to Spotify", "Album"];
    let Data = [artist, name, spotify, album];
    ct({Category, Data});
});
}

let movie  = (t) => {
    fs.appendFile("log.txt", "\nSearched for the movie titled: " + t, (e) => {
        if(e) throw e;
        cl(br + "           Searching . . . " + br + br);
    });
    let URL = "http://www.omdbapi.com/?t=" + t + "&y=&plot=short&apikey=trilogy";
    axios.get(URL).then((r) => {
        const rd = r.data;
        let t = rd.Title;
        let y = rd.Year;
        let ir = rd.Ratings[0].Value;
        let rr = rd.Ratings[1].Value;
        let c = rd.Country;
        let p = rd.Plot;
        let a = rd.Actors;
    
   
        cl(br + hr + br);
        cl("Title: " + t);
        cl("Year: " + y);
        cl("IMDB Rating: " + ir);
        cl("Rotton Tomato Rating: " + rr);
        cl("Country: " + c);
        cl("Plot: " + p);
        cl("Actors: " + a);
        cl(br + hr + br);
    });
}


cl(br + hr + br + "                WELCOME TO YOUR OWN PERSONAL LIRI!" + br + br);
i.prompt([
    {
        type: "list",
        message: "What would you like to search?\n",
        choices: ["Song (by title)", "Concert (by artist)", "Movie (by title)"],
        name: "choice",
    }
]).then((r) => {
        switch (r.choice) {
            case "Song (by title)":
                i.prompt([
                    {
                        type: "input",
                        message: br + "What song title would you like to search for?\n",
                        name: "sel",
                    }
                ]).then((r) => {
                    search(r.sel);
                });
                break;

            case "Concert (by artist)": 
            i.prompt([
                {
                    type: "input",
                    message: br + "Which artist's concert would you like to search for?\n",
                    name: "sel",
                }
            ]).then((r) => {
                event(r.sel);
            });
                break;

            case "Movie (by title)": 
            i.prompt([
                {
                    type: "input",
                    message: br + "What movie title would you like to search for?\n",
                    name: "sel",
                }
            ]).then((r) => {
                movie(r.sel);
            });
                break;
            default: "Movie (by title)"
                movie("Mr. Nobody");
                break;
        }
});

// search("red hot chili peppers");
// event("red hot chili peppers");
// movie("frozen");