import React from "react";
import TopSongsBoard from "../src/split-board/top-songs-board";

export default async function fetchMusicSummaries(developerToken, userToken) {
    try {
        console.log("Retrieving summaries from Apple Music API.");

        const res = await fetch(
            `https://api.music.apple.com/v1/me/music-summaries/year-2025?l=en-us&omit%5Bresource%5D=autos&extend=editorialVideo%2ClisteningStreaks&views=top-artists%2Ctop-albums%2Ctop-songs&fields[songs]=name%2CartistName%2Cartwork%2Cpreviews%2CeditorialVideo%2CgenreNames%2CcontentRating%2Curl&fields[artists]=name%2Cartwork%2CeditorialVideo%2Curl&fields[albums]=name%2Cartwork%2CartistName%2CeditorialVideo%2CcontentRating%2CeditorialVideo%2Curl&fields[stations]=name%2Cartwork%2Curl&fields[playlists]=name%2Cartwork%2Curl%2CeditorialVideo&include[music-summaries]=playlist&include[artist-period-summaries]=artist&include[album-period-summaries]=album&include[song-period-summaries]=song`,
            {
                headers: {
                    Authorization: `Bearer ${developerToken}`,
                    "Music-User-Token": userToken,
                },
            }
        );

        if (!res.ok) throw new Error(`Apple API Error: ${res.status}`);
        const data = await res.json();
        try {
            const items = data.data || [];
            const views = items[0]?.views || {}; // Use optional chaining
            console.log("views:", views);
            // Parse each view type
            const topArtists = views['top-artists']?.data || [];
            const topSongs = views['top-songs']?.data || [];
            const topAlbums = views['top-albums']?.data || [];

            console.log("Top Artists:", topArtists);
            console.log("Top Songs:", topSongs.slice(0, 10));
            console.log("Top Albums:", topAlbums);
            console.log("Top Songs data:", topSongs[0]?.relationships?.song?.data?.[0].attributes.artistName);
            //const songData = item?.relationships?.song?.data?.[0];
            //const attr = songData?.attributes;
            return <TopSongsBoard items={topSongs.slice(0,10)} showAlbumArt={true} />;            
        } catch (err) {
            console.error("Failed to return music summaries:", err);
            return (
                <div className="board-container">
                    <div className="board-content">
                        <pre style={{ color: 'white', textAlign: 'left', padding: '20px' }}>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </div>
            );
        }        
    } catch (err) {
        console.error("Failed to fetch music summaries:", err);
        return <div className="no-data">Failed to load summaries</div>;
    }
}

function FlapText({ text }) {
    return (
        <div className={`flap-row`}>
            {[...text].map((char, i) => (
                <motion.div
                    key={i}
                    className="flap-tile"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ delay: i * 0.015, duration: 0.15 }}
                >
                    {char}
                </motion.div>
            ))}
        </div>
    );
}