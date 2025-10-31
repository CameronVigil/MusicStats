// api/music-summaries.jsx
export default async function handler(req, res) {
    // Handle preflight OPTIONS request for CORS
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*"); // Or your domain
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, Music-User-Token"
        );
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { userToken } = req.query;

        if (!userToken) {
            return res.status(400).json({ error: "Missing Music-User-Token" });
        }

        // Your developer token should be stored in environment variables
        const developerToken = process.env.DEV_TOKEN;

        const appleRes = await fetch(
            `https://amp-api.music.apple.com/v1/me/music-summaries/search?l=en-us&period=year&fields[music-summaries]=period,year`,
            {
                headers: {
                    Authorization: `Bearer ${developerToken}`,
                    "Music-User-Token": userToken,
                },
            }
        );

        const data = await appleRes.json();

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
/*amp-api.music.apple.com/v1/me/music-summaries/search?l=en-us&period=year&fields[music-summaries]=period,year */