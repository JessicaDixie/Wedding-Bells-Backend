const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "your-local-mongo-uri";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Render backend is working!");
});

// RSVP Schema
const rsvpSchema = new mongoose.Schema({
  name: String,
  attending: String,
  plusOne: String
});
const RSVP = mongoose.model("RSVP", rsvpSchema);

// Song Schema
const songSchema = new mongoose.Schema({
  song: String,
  artist: String
});
const Song = mongoose.model("Song", songSchema);


// File paths
const rsvpFile = 'rsvps.json';
const songsFile = 'songs.json';

// RSVP Endpoint

app.post("/api/rsvp", async (req, res) => {
  const { name, attending, plusOne } = req.body;
  if (!name || !attending || !plusOne) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newRsvp = new RSVP({ name, attending, plusOne });
    await newRsvp.save();
    res.json({ message: "RSVP saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving RSVP" });
  }
});

// --- Song Suggestion Endpoint ---
app.post("/api/songs", async (req, res) => {
  const { song, artist } = req.body;
  if (!song || !artist) {
    return res.status(400).json({ message: "Song and artist are required." });
  }

  try {
    const newSong = new Song({ song, artist });
    await newSong.save();
    res.json({ message: "Song suggestion saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving song suggestion" });
  }
});

//Get all RSVPs
app.get("/api/rsvp", async (req, res) => {
  try {
    const rsvps = await RSVP.find({});
    res.json(rsvps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch RSVPs" });
  }
});

//Get all song suggestions
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find({});
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch songs" });
  }
});

// Start  server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
