import React from "react";

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
            console.log("Top Songs:", topSongs);
            console.log("Top Albums:", topAlbums);

            // Return formatted data
            return (
                <div className="board-container">
                    <div className="board-content">
                        <div style={{ color: 'white', textAlign: 'left', padding: '20px' }}>
                            <h2>Top Artists</h2>
                            {topArtists.map((item, idx) => (
                                <div key={idx}>
                                    {idx + 1}. {item.attributes?.name || 'Unknown'}
                                </div>
                            ))}

                            <h2 style={{ marginTop: '20px' }}>Top Songs</h2>
                            {topSongs.map((item, idx) => (
                                <div key={idx}>
                                    {idx + 1}. {item.attributes?.name || 'Unknown'} - {item.attributes?.artistName || 'Unknown'}
                                </div>
                            ))}

                            <h2 style={{ marginTop: '20px' }}>Top Albums</h2>
                            {topAlbums.map((item, idx) => (
                                <div key={idx}>
                                    {idx + 1}. {item.attributes?.name || 'Unknown'} - {item.attributes?.artistName || 'Unknown'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );


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