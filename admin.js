const API_URL = "https://wedding-bells-backend.onrender.com"; // Backend service base address (Render deployment)


// =====================================================================
// LOAD AND DISPLAY RSVP DATA
// =====================================================================

// Fetches all RSVP entries from the backend API and populates the "rsvpTable" with the results
async function loadRsvps() {
  // Retrieve RSVP records from backend
  const res = await fetch(`${API_URL}/api/rsvp`);
  const rsvps = await res.json();

  // Select table body and clear existing rows
  const table = document.querySelector("#rsvpTable tbody");
  table.innerHTML = "";

  // Insert each RSVP entry as a new row
  rsvps.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.name}</td>
      <td>${r.attending}</td>
      <td>${r.plusOne}</td>
    `;
    table.appendChild(row);
  });
}


// =====================================================================
// LOAD AND DISPLAY SONG SUGGESTION DATA
// =====================================================================

//Fetches all song entries from the backend API and populates the "songTable" with the results
async function loadSongs() {
  // Retrieve all Song records from the backend
  const res = await fetch(`${API_URL}/api/songs`);
  const songs = await res.json();

  // Select table body and clear existing rows
  const table = document.querySelector("#songTable tbody");
  table.innerHTML = "";

  // Insert each Song entry as a new row
  songs.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.song}</td>
      <td>${s.artist}</td>
    `;
    table.appendChild(row);
  });
}

// Initial Page load
loadRsvps();
loadSongs();
