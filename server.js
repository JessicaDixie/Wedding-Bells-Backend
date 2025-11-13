const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000; // Local port

// Middleware
app.use(cors()); // Allows frontend requests from localhost
app.use(express.json());

// File paths
const rsvpFile = 'rsvps.json';
const songsFile = 'songs.json';

// --- RSVP Endpoint ---

app.post("/api/rsvp", (req, res) => {
  const { name, attending, plusOne } = req.body;

  if (!name || !attending || !plusOne) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newRsvp = { name, attending, plusOne };

  if (fs.existsSync(rsvpFile)) {
   const fileContent = fs.readFileSync(rsvpFile, "utf8");
   let rsvps;
   if(fileContent.trim() === ''){
    //file is empty, start with new array
    rsvps = [];
   }else{
    //parse existing JSON content so that it does not get overwritten by new submission
    try{
      rsvps = JSON.parse(fileContent);
      if(!Array.isArray(rsvps)){
        //If JSON exists but isnt an array, wrap it in an array
        rsvps = [rsvps];
      }
    }catch(err){
        console.error('Error parsing JSON', err);
        rsvps = [];
      }
   }
   //add new rsvp submission to array
   rsvps.push(newRsvp);
   //write entire array back to the file
   fs.writeFileSync(rsvpFile, JSON.stringify(rsvps, null, 2), 'utf8');
   console.log('New input added to JSON file.');
  }
  var newContent = fs.readFileSync(rsvpFile, "utf8");
  console.log(newContent);

  res.json({ message: "RSVP saved successfully!" });
});


// --- Song Suggestion Endpoint ---
app.post("/api/songs", (req, res) => {
  const { song, artist } = req.body;

  if (!song || !artist) {
    return res.status(400).json({ message: "Song and artist are required." });
  }

  const newSong = { song, artist };
  
  if (fs.existsSync(songsFile)) {
   console.log('songs file exists');
   const fileContent = fs.readFileSync(songsFile, "utf8");
   let songs;
   if(fileContent.trim() === ''){
    //file is empty, start with new array
    songs = [];
   }else{
    //parse existing JSON content so that it does not get overwritten by new submission
    try{
      songs = JSON.parse(fileContent);
      if(!Array.isArray(songs)){
        //If JSON exists but isnt an array, wrap it in an array
        songs = [songs];
      }
    }catch(err){
        console.error('Error parsing JSON', err);
        songs = [];
      }
   }
   //add new rsvp submission to array
   songs.push(newSong);
   //write entire array back to the file
   fs.writeFileSync(songsFile, JSON.stringify(songs, null, 2), 'utf8');
   console.log('New input added to JSON file.');
  }
  var newContent = fs.readFileSync(songsFile, "utf8");
  console.log(newContent);

  res.json({ message: "Song suggestion saved successfully!" });
});

// Start local server
app.listen(PORT, () => console.log(`Local server running on http://localhost:${PORT}`));
