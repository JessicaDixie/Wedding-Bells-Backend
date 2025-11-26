// =====================================================================
// DEPENDENCIES AND INITAL SETUP
// =====================================================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "your-local-mongo-uri"; // MongoDB connection string (from Render environment or fallback local URI)
// Connect to MongoDB Atlas or local MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// Allow cross-origin requests (needed for frontend to backend communication)
app.use(cors({
  origin: "https://jessicadixie.github.io",
  credentials: true
}));



// =====================================================================
// MIDDLEWARE
// =====================================================================

app.use(express.json()); // Parse incoming JSON request bodies
app.use(cookieParser());

// Basic root route to verify server is running
app.get("/", (req, res) => {
  res.send("Render backend is working!");
});


// =====================================================================
// DATABASE SCHEMAS & MODELS
// =====================================================================

// RSVP schema defines valid structure for RSVP entries
const rsvpSchema = new mongoose.Schema({
  name: String,
  attending: String,
  plusOne: String
});
const RSVP = mongoose.model("RSVP", rsvpSchema);

// Song schema defines valid structure for Song Suggestion entries
const songSchema = new mongoose.Schema({
  song: String,
  artist: String
});
const Song = mongoose.model("Song", songSchema);


// Legacy file path definitions (kept for compatibility if you ever want local JSON storage) 
//const rsvpFile = 'rsvps.json';
//const songsFile = 'songs.json';


// =====================================================================
// API POST AND GET ENDPOINTS
// =====================================================================

// POST: "Submit RSVP"
app.post("/api/rsvp", async (req, res) => {
  const { name, attending, plusOne } = req.body;
  // Validate required fields
  if (!name || !attending || !plusOne) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create a new RSVP and store it in MongoDB
    const newRsvp = new RSVP({ name, attending, plusOne });
    await newRsvp.save();
    res.json({ message: "RSVP saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving RSVP" });
  }
});

// POST: "Submit Suggestion"
app.post("/api/songs", async (req, res) => {
  const { song, artist } = req.body;
  // Validate required fields
  if (!song || !artist) {
    return res.status(400).json({ message: "Song and artist are required." });
  }

  try {
    // Create a new Song and store it in MongoDB
    const newSong = new Song({ song, artist });
    await newSong.save();
    res.json({ message: "Song suggestion saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving song suggestion" });
  }
});

// GET: Retrieve all RSVPs
app.get("/api/rsvp", async (req, res) => {
  try {
    // Fetch all RSVP entries from MongoDB 
    const rsvps = await RSVP.find({});
    res.json(rsvps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch RSVPs" });
  }
});

// GET: Retrieve all song suggestions
app.get("/api/songs", async (req, res) => {
  try {
    // Fetch all Song entries from MongoDB 
    const songs = await Song.find({});
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch songs" });
  }
});

// =====================================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================================================

function requireAuth(req, res, next) {
  if (req.cookies && req.cookies.adminAuth === process.env.ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).send("Unauthorized");
}


// =====================================================================
// LOGIN AUTHENTICATION
// =====================================================================

// POST: handles admin login authentication
app.post("/api/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.cookie("adminAuth", process.env.ADMIN_PASSWORD, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: "Incorrect Password" });
});

// =====================================================================
// SHOW ADMIN-ONLY FILES
// =====================================================================

// Serve admin panel files ONLY after password verification
app.get("/admin", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});


// =====================================================================
// START SERVER
// =====================================================================

const PORT = process.env.PORT || 5000; // pickup port from environment (Render) or default to 5000 locally
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
