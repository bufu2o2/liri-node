require("dotenv").config();
const i = require("inquirer");
const mo = require("moment");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const c = require("chalk");
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
        if(e) cl(c.red.bold(e));
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
            cl(c.red.bold(br + artist + " doesn't have any upcoming concerts" + br + hr + br));
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
        if(e) cl(c.red.bold(e));
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
        if(e) throw cl(c.red.bold(e));
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


let custom = (customSearch) => {
    fs.writeFile("random.txt", customSearch, (e) => {
        if(e) throw cl(c.red.bold(e));
    });
    fs.readFile("random.txt", "utf8", (e, d) => {
        if(e) throw cl(c.red.bold(e));

    let file = d.trim().split(" ");
    let q = d.split('"');
    
    for(let i=0; i<file.length; i++){
        if(file[i] === "song"){
            cl(c.green("Searching for your song " + q[1]));
            return search(q[1].trim());
        }
        else if(file[i] === "movie"){
            cl(c.green("Searching for your movie " + q[1]));
            return movie(q[1].trim());
        }
        else if(file[i] === "concert"){
            cl(c.green("Searching for your concert " + q[1]));
            return event(q[1].trim());
        }
    }
    });
}










cl(br + hr + br + "                WELCOME TO YOUR OWN PERSONAL LIRI!" + br + br);
i.prompt([
    {
        type: "list",
        message: "What would you like to search?\n",
        choices: ["Song (by title)", "Concert (by artist)", "Movie (by title)", "Type your own custom search"],
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

            case "Type your own custom search": 
            i.prompt([
                {
                    type: "input",
                    message: br + "Please put quotes around the artist, movie, or song you'd like to search (:\n\n-Liri\n\n\n",
                    name: "sel",
                }
            ]).then((r) => {
                custom(r.sel);
            });
                break;
        }
});

// search("red hot chili peppers");
// event("red hot chili peppers");
// movie("frozen");