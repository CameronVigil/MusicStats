# Apple Music Stats Web App

A full-stack web application that connects to **Apple Music** using the **MusicKit JS SDK** to allow users to sign in with their Apple ID and view their personalized music stats and summaries.

This project demonstrates secure Apple Music authentication, token generation, and API consumption using modern web technologies.

---

Features

-  **Apple Music Authentication** using MusicKit JS  
-  **Fetch and display user listening data** from the Apple Music API  
-  **Auto-expiring sessions** — tokens and cookies are cleared after inactivity  
-  **CORS-secure backend** for generating Apple developer tokens  
-  **Modern React frontend** for a clean, responsive interface  


Future Enhancements

 Display top artists, albums, and genres in a dashboard

 Add a Google Maps view of nearby concerts for favorite artists

 AI-simulated user profiles for testing analytics and recommendations

 Integrate with FileMaker or another database for persistent user storage
 **AI Simulation Mode** — simulate users and their music activity  
## Prerequisites

Before running the app, you’ll need:

1. **Apple Developer Account**  
   - Create a **MusicKit key** in your Apple Developer portal.  
   - Note your **Team ID**, **Key ID**, and download the `.p8` private key file.

2. **Environment Variables**
   Create a `.env` file in your backend directory and include:

   ```bash
   APPLE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_MUSICKIT_KEY_CONTENTS\n-----END PRIVATE KEY-----"
   APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_DEVELOPER_KEY_CONTENTS\n-----END PRIVATE KEY-----"
   TEAM_ID="YOUR_TEAM_ID"
   MUSIC_KEY_ID="YOUR_MUSICKIT_KEY_ID"
   DEV_KEY_ID="YOUR_DEVELOPER_KEY_ID"

npm install
node generateToken.js
npm install
npm run dev


const res = await fetch("https://your-deployment-url.vercel.app/api/apple-token");
const { token } = await res.json();





   
