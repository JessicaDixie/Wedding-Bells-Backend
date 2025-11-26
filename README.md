# Wedding-Bells
DLBCSPJWD01 Project

🎉Inge & Mark’s Wedding Website — Backend

This repository contains the backend for the wedding website of Inge and Mark.
It provides:
- Secure admin authentication
- Protected admin page
- RSVP submission endpoints
- Song suggestion submission endpoints
- MongoDB Atlas integration
    
The backend is built using Node.js, Express.js, and MongoDB Atlas, and is deployed on Render 



📁 Repository Structure

Wedding-Bells-Backend/

    ├── .gitignore
    ├── LICENSE      
    ├── package-lock.json
    ├── package.json
    ├── admin.html
    ├── admin.css
    ├── admin.js
    ├── rsvps.json      # Placeholder file required only for Render; not used for storage
    ├── songs.json      # Placeholder file required only for Render; not used for storage
    └── server.js       # Main Express server
    
MongoDB Atlas is used for all persistent storage.

Note: The admin dashboard (admin.html, admin.css, admin.js) now lives entirely inside the backend, ensuring that admin access is fully controlled by server-side authentication.


🛠️ Technologies 
- Node.js
- Express.js
- MongoDB Atlas (via Mongoose)
- CORS
- Render (backend hosting)


🔧 Installation (Local Setup)

Follow these steps to run the backend locally before deploying.

1. Clone the repository:
   
        git clone https://github.com/JessicaDixie/Wedding-Bells-Backend.git
        cd Wedding-Bells-Backend
2. Install dependencies

        npm install
3. Create a .env file (optional for local testing) in the root folder:

        MONGO_URI=<your MongoDB connection string>
        ADMIN_PASSWORD=<your chosen admin password>
        PORT=5000
4. Start the server

        npm start   
If successful, you will see:

        Connected to MongoDB Atlas
        Server running on port 5000


🌐 Running Locally With the Frontend

If you are testing locally by replacing GitHub Pages with local files, then open index.html directly in the browser and make sure that the frontend script points to:

    const API_BASE = "http://localhost:5000"


🔒 Environment Variables

| Variable         | Description                          |
| ---------------- | ------------------------------------ |
| `MONGO_URI`      | Full MongoDB Atlas connection string |
| `ADMIN_PASSWORD` | Password required for admin login    |
| `PORT`           | Optional — defaults to 5000          |

Where to set these in Render: Render Dashboard → Project → Environment → Environment Variables


🚀 Deployment Instructions (Render)

1. Create a new Web Service

    - Environment: Node
    - Build Command:
      
          npm install
    - Start Command:

          node server.js

2. Add the required environment variables

    - `MONGO_URI`
    - `ADMIN_PASSWORD`

3. Deploy

    Render will allocate a public URL such as:

           https://wedding-bells-backend.onrender.com

   Use this URL in the frontend JavaScript:

           const API_BASE = "https://wedding-bells-backend.onrender.com";

Note: Render free-tier services may take several seconds to start responding after periods of inactivity.
Frontend interactions (such as API calls or admin login) may be shortly delayed while the service 'wakes up'.


🔐 Security Notes
- Admin access for grading (optional)
  * A temporary admin password can be provided privately upon request to the course instructor. For security reasons, the production admin password is not included in this repository.
- The admin dashboard is served (the admin.html with the admin.css and admin.js) to the frontend, only after validating the secure cookie.
- The cookie is:
  * HTTP-Only (cannot be accessed by JavaScript)
  * Secure (sent only over HTTPS)
  * SameSite=None (supports cross-origin frontend to backend requests)
    This prevents unauthorized users from accessing the admin page via direct URL or by bypassing the frontend login.
- Sensitive information is never stored in the frontend
  

   
        

