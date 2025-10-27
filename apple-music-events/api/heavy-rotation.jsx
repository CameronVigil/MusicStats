// heavy-rotation.js
import React from "react";

export default async function fetchHeavyRotation(developerToken, userToken) {
    try {
        console.log("Developer token:", developerToken);
        console.log("User token:", userToken);

        const res = await fetch(
            `https://api.music.apple.com/v1/me/history/heavy-rotation?limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${developerToken}`,
                    "Music-User-Token": userToken,
                },
            }
        );

        if (!res.ok) throw new Error(`Apple API Error: ${res.status}`);
        const data = await res.json();
        const items = data.data || [];

        return (
            <div className="heavy-rotation-container">
                {items.map((item) => {
                    const attr = item.attributes || {};
                    const artworkUrl =
                        attr.artwork?.url
                            ?.replace("{w}", "300")
                            ?.replace("{h}", "300") ||
                        "https://via.placeholder.com/300x300?text=No+Art";

                    return (
                        <div key={item.id} className="album-card">
                            <img
                                src={artworkUrl}
                                alt={attr.name || "Unknown Album"}
                                className="album-art"
                                width="150"
                                height="150"
                            />

                            <div className="album-info">
                                <h2 className="album-title">{attr.name || "Untitled Album"}</h2>
                                <p className="artist-name">{attr.artistName || "Unknown Artist"}</p>

                                <ul className="album-details">
                                    {attr.genreNames && (
                                        <li>
                                            <strong>Genre:</strong> {attr.genreNames.join(", ")}
                                        </li>
                                    )}
                                    {attr.releaseDate && (
                                        <li>
                                            <strong>Release Date:</strong> {attr.releaseDate}
                                        </li>
                                    )}
                                    {attr.recordLabel && (
                                        <li>
                                            <strong>Label:</strong> {attr.recordLabel}
                                        </li>
                                    )}
                                    {attr.trackCount && (
                                        <li>
                                            <strong>Tracks:</strong> {attr.trackCount}
                                        </li>
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
                    );
                })}
            </div>
        );
    } catch (err) {
        console.error("Failed to fetch summaries:", err);
    }
}
