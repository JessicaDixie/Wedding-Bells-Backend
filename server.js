const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- RSVP Endpoint ---
app.post('/api/rsvp', (req, res) => {
  const { name, attending, plusOne } = req.body;

  if (!name || !attending || !plusOne) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newRSVP = { name, attending, plusOne };

  const rsvpFile = path.join(__dirname, 'rsvps.json');
  let rsvps = [];

  if (fs.existsSync(rsvpFile)) {
    const data = fs.readFileSync(rsvpFile);
    rsvps = JSON.parse(data);
  }

  rsvps.push(newRSVP);
  fs.writeFileSync(rsvpFile, JSON.stringify(rsvps, null, 2));

  res.status(200).json({ message: 'RSVP saved successfully!' });
});

// --- Song Suggestion Endpoint ---
app.post('/api/songs', (req, res) => {
  const { song, artist } = req.body;

  if (!song || !artist) {
    return res.status(400).json({ message: 'Song and artist are required.' });
  }

  const newSong = { song, artist };

  const songsFile = path.join(__dirname, 'songs.json');
  let songs = [];

  if (fs.existsSync(songsFile)) {
    const data = fs.readFileSync(songsFile);
    songs = JSON.parse(data);
  }

  songs.push(newSong);
  fs.writeFileSync(songsFile, JSON.stringify(songs, null, 2));

  res.status(200).json({ message: 'Song suggestion saved successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
