// api/music-summaries.jsx
export default async function handler(req, res) {
    // Handle preflight OPTIONS request for CORS
    
    res.setHeader("Access-Control-Allow-Origin", "*"); // Or your domain
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Music-User-Token"
    );
     
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        const { userToken, developerToken } = req.query;

        if (!userToken || !developerToken) {
            return res.status(400).json({ error: "Missing Music-User-Token" });
        }
        console.log("Retrieving summaries.");
        const appleRes = await fetch(
            `https://api.music.apple.com/v1/me/music-summaries/month-2025-10`,
            {
                headers: {
                    Authorization: `Bearer ${developerToken}`,
                    "Music-User-Token": userToken,
                },
            }
        );
        console.log("Retrieved summaries.");
        return appleRes;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
