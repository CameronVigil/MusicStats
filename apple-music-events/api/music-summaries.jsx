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

        const appleRes2 = await fetch(
            `https://amp-api.music.apple.com/v1/me/music-summaries/year-2025?l=en-us&omit[resource]=autos&extend=editorialVideo,listeningStreaks&views=top-artists,top-albums,top-songs&fields[songs]=name,artistName,artwork,previews,editorialVideo,genreNames,contentRating,url&fields[artists]=name,artwork,editorialVideo,url&fields[albums]=name,artwork,artistName,editorialVideo,contentRating,editorialVideo,url&fields[stations]=name,artwork,url&fields[playlists]=name,artwork,url,editorialVideo&include[music-summaries]=playlist&include[artist-period-summaries]=artist&include[album-period-summaries]=album&include[song-period-summaries]=song`,
            {
                headers: {
                    Authorization: `Bearer ${developerToken}`,
                    "Music-User-Token": userToken,
                },
            }
        );
        console.log("Retrieved summaries.");
        const data2 = await appleRes2.data;

        const appleRes3 = await fetch(
            `https://amp-api.music.apple.com/v1/me/music-summaries/month-2025-9?extend=insightKinds,listeningStreaks&views=top-artists,top-albums,top-songs-for-months,top-playlists,top-genres,top-stations&fields[artists]=name,artwork,editorialVideo&fields[albums]=name,artwork,artistName,contentRating,editorialVideo&fields[stations]=name,artwork&fields[playlists]=name,artwork,url,editorialVideo&fields[songs]=name,artistName,artwork,previews,genreNames,contentRating&include[playlist-period-summaries]=playlist&include[station-period-summaries]=station&include[genre-period-summaries]=genres&include[monthly-song-period-summaries]=song`,
            {
                headers: {
                    Authorization: `Bearer ${developerToken}`,
                    "Music-User-Token": userToken,
                },
            }
        );
        console.log("Retrieved summaries.");
        const data3 = await appleRes3.data;

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
/*	https://amp-api.music.apple.com/v1/me/music-summaries/search?l=en-us&omit[resource]=autos&period=month&year=2025&include=top-songs-abridged,top-albums-abridged,top-artists-abridged&fields[songs]=name,artwork&fields[artists]=name,artwork&fields[albums]=name,artwork

https://amp-api.music.apple.com/v1/me/music-summaries/year-2025?l=en-us&omit[resource]=autos&extend=editorialVideo,listeningStreaks&views=top-artists,top-albums,top-songs&fields[songs]=name,artistName,artwork,previews,editorialVideo,genreNames,contentRating,url&fields[artists]=name,artwork,editorialVideo,url&fields[albums]=name,artwork,artistName,editorialVideo,contentRating,editorialVideo,url&fields[stations]=name,artwork,url&fields[playlists]=name,artwork,url,editorialVideo&include[music-summaries]=playlist&include[artist-period-summaries]=artist&include[album-period-summaries]=album&include[song-period-summaries]=song
https://amp-api.music.apple.com/v1/me/music-summaries/month-2025-9?extend=insightKinds,listeningStreaks&views=top-artists,top-albums,top-songs-for-months,top-playlists,top-genres,top-stations&fields[artists]=name,artwork,editorialVideo&fields[albums]=name,artwork,artistName,contentRating,editorialVideo&fields[stations]=name,artwork&fields[playlists]=name,artwork,url,editorialVideo&fields[songs]=name,artistName,artwork,previews,genreNames,contentRating&include[playlist-period-summaries]=playlist&include[station-period-summaries]=station&include[genre-period-summaries]=genres&include[monthly-song-period-summaries]=song

*/