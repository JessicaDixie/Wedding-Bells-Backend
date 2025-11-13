const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();

// Middleware
app.use(cors()); // Allows frontend requests from localhost
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Render backend is working!");
});

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

  let rsvps = [];
  if (fs.existsSync(rsvpFile)) {
    const fileContent = fs.readFileSync(rsvpFile, "utf8");
    if (fileContent.trim() !== "") {
      try {
        rsvps = JSON.parse(fileContent);
        if (!Array.isArray(rsvps)) rsvps = [rsvps];
      } catch (err) {
        console.error("Error parsing JSON", err);
        rsvps = [];
      }
    }
  }

  // Add the new entry
  rsvps.push(newRsvp);
  // Write back to file (creates it if missing)
  fs.writeFileSync(rsvpFile, JSON.stringify(rsvps, null, 2), "utf8");

  console.log("New RSVP added:", newRsvp);
  res.json({ message: "RSVP saved successfully!" });
});

// --- Song Suggestion Endpoint ---
app.post("/api/songs", (req, res) => {
  const { song, artist } = req.body;

  if (!song || !artist) {
    return res.status(400).json({ message: "Song and artist are required." });
  }

  const newSong = { song, artist };

  let songs = [];
  if (fs.existsSync(songsFile)) {
    const fileContent = fs.readFileSync(songsFile, "utf8");
    if (fileContent.trim() !== "") {
      try {
        songs = JSON.parse(fileContent);
        if (!Array.isArray(songs)) songs = [songs];
      } catch (err) {
        console.error("Error parsing JSON", err);
        songs = [];
      }
    }
  }

  // Add the new entry
  songs.push(newSong);
  // Write back to file (creates it if missing)
  fs.writeFileSync(songsFile, JSON.stringify(songs, null, 2), "utf8");

  console.log("New song added:", newSong);
  res.json({ message: "Song suggestion saved successfully!" });
});


// Start  server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
