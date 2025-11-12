// recently-played-tracks.jsx

export default async function fetchRecentTracks(developerToken, userToken) {
    try {
        console.log("Developer token:", developerToken);
        console.log("User token:", userToken);
        const res = await fetch(`https://api.music.apple.com/v1/me/recent/played/tracks` , {
            headers: {
                Authorization: `Bearer ${developerToken}`,
                "Music-User-Token": userToken,
            },
        });

        if (!res.ok) throw new Error(`Apple API Error: ${res.status}`);
        const data = await res.json();
        const items = data.data || [];
        console.log(items);
        return (
            <div className="heavy-rotation">
                {items.map((item) => {
                    const attr = item.attributes;
                    if (!attr) return null;
                    console.log("Attributes:" + item.attributes);
                    const artworkUrl = attr.artwork?.url
                        ?.replace("{w}", "300")
                        ?.replace("{h}", "300");

                    // Determine if it's an album or playlist
                    const isPlaylist = item.type === "library-playlists";
                    const typeLabel = isPlaylist ? "Playlist" : "Album";
                    if (!isPlaylist) {
                        return (
                            <div key={item.id} className="album-card">
                                {artworkUrl && (
                                    <img
                                        src={artworkUrl}
                                        alt={attr.name || "Artwork"}
                                        className="album-art"
                                    />
                                )}

                                <div className="album-info">
                                    <h2 className="album-title">{attr.name}</h2>
                                    <p className="artist-name">
                                        {isPlaylist
                                            ? attr.curatorName || "Apple Music"
                                            : attr.artistName || "Unknown Artist"}
                                    </p>

                                    <ul className="album-details">
                                        <li> {typeLabel}</li>

                                        {attr.genreNames?.length > 0 && (
                                            <li>
                                                {attr.genreNames.join(", ")}
                                            </li>
                                        )}
                                        {attr.releaseDate && (
                                            <li>
                                                {attr.releaseDate}</li>
                                        )}
                                        {attr.recordLabel && (
                                            <li>
                                                {attr.recordLabel}</li>
                                        )}
                                        {attr.trackCount && (
                                            <li>
                                                {attr.trackCount}<strong> Tracks</strong> </li>
                                        )}
                                    </ul>

                                    {attr.editorialNotes?.short && (
                                        <p className="album-note">“{attr.editorialNotes.short}”</p>
                                    )}

                                    {attr.url && (
                                        <a
                                            href={attr.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="album-link"
                                        >
                                            View on Apple Music →
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    };
                })}
            </div>
        );
    } catch (err) {
        console.error("Failed to fetch summaries:", err);
    }
};
