// api/music-summaries.jsx
export default async function handler(req, res) {
    // Handle preflight OPTIONS request for CORS
    
        res.setHeader("Access-Control-Allow-Origin", "*"); // Or your domain
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, Music-User-Token"
        );
     
    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { userToken, developerToken } = req.query;

        if (!userToken || developerToken) {
            return res.status(400).json({ error: "Missing Music-User-Token" });
        }
        console.log("Retrieving summaries.");
        const appleRes = await fetch(
            `https://api.music.apple.com/v1/me/music-summaries/search?l=en-us&year=2025&period=month`,
            {
                headers: {
                    Authorization: `Bearer ${developerToken}`,
                    "Music-User-Token": userToken,
                },
            }
        );
        console.log("Retrieved summaries.");
        const data = await appleRes.data;

        // Send CORS headers for the actual response
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
