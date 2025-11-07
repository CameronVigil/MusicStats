import React from "react";
import { motion } from "framer-motion";

export default async function fetchHeavyRotation(developerToken, userToken) {
    try {
        const res = await fetch(`https://api.music.apple.com/v1/me/history/heavy-rotation`, {
            headers: {
                Authorization: `Bearer ${developerToken}`,
                "Music-User-Token": userToken,
            },
        });

        if (!res.ok) throw new Error(`Apple API Error: ${res.status}`);
        const data = await res.json();
        const items = data.data || [];

        console.log(items);
        if (items.length === 0) {
            return <div className="no-data">No heavy rotation data available</div>;
        }
        const TILES_PER_ROW = 50;
        const ALBUM_TILES = 1;
        const TITLE_TILES = 25;
        const ARTIST_TILES = 20;


        return (
            <div className="board-container">
                <div className="board-content">
                    {/* Header Row */}
                    <div className="board-row">
                        {/* COVER header */}
                        {[...Array(ALBUM_TILES)].map((_, i) => (
                            <motion.div
                                key={`h-album-${i}`}
                                className="flap-tile header"
                                initial={{ rotateX: -90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                transition={{ delay: i * 0.02, duration: 0.3 }}
                            >
                                <div className="flap-divider" />
                                <div className="flap-content">
                                    {i < "COVER".length ? "COVER"[i] : " "}
                                </div>
                            </motion.div>
                        ))}

                        {/* Separator */}
                        <div className="flap-tile separator">
                            <div className="flap-divider" />
                        </div>

                        {/* TITLE header */}
                        {[...Array(TITLE_TILES)].map((_, i) => (
                            <motion.div
                                key={`h-title-${i}`}
                                className="flap-tile header"
                                initial={{ rotateX: -90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                transition={{ delay: (ALBUM_TILES + 1 + i) * 0.02, duration: 0.3 }}
                            >
                                <div className="flap-divider" />
                                <div className="flap-content">
                                    {i < "TITLE".length ? "TITLE"[i] : " "}
                                </div>
                            </motion.div>
                        ))}

                        {/* Separator */}
                        <div className="flap-tile separator">
                            <div className="flap-divider" />
                        </div>

                        {/* ARTIST header */}
                        {[...Array(ARTIST_TILES)].map((_, i) => (
                            <motion.div
                                key={`h-artist-${i}`}
                                className="flap-tile header"
                                initial={{ rotateX: -90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                transition={{ delay: (ALBUM_TILES + TITLE_TILES + 2 + i) * 0.02, duration: 0.3 }}
                            >
                                <div className="flap-divider" />
                                <div className="flap-content">
                                    {i < "ARTIST".length ? "ARTIST"[i] : " "}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Data Rows */}
                    {items.map((item, rowIndex) => {
                        const attr = item.attributes;
                        if (!attr) return null;

                        const title = (attr.name || "Untitled").toUpperCase();
                        const artist = (attr.artistName || "Unknown").toUpperCase();
                        const artwork = attr.artwork?.url
                            ?.replace("{w}", "100")
                            ?.replace("{h}", "100");

                        const titlePadded = title.padEnd(TITLE_TILES, ' ');
                        const artistPadded = artist.padEnd(ARTIST_TILES, ' ');

                        return (
                            <div key={rowIndex} className="board-row">
                                {/* Album Art as tiles */}
                                {[...Array(ALBUM_TILES)].map((_, i) => (
                                    <motion.div
                                        key={`album-${rowIndex}-${i}`}
                                        className="album-tile"
                                        initial={{ scale: 0, rotateY: 180 }}
                                        animate={{ scale: 1, rotateY: 0 }}
                                        transition={{
                                            delay: (rowIndex + 1) * 0.15 + i * 0.02,
                                            duration: 0.4,
                                            type: "spring"
                                        }}
                                    >
                                        {artwork && <img src={artwork} alt="" />}
                                    </motion.div>
                                ))}

                                {/* Separator */}
                                <div className="flap-tile separator">
                                    <div className="flap-divider" />
                                </div>

                                {/* Title tiles */}
                                {[...titlePadded.slice(0, TITLE_TILES+1)].map((char, i) => (
                                    <motion.div
                                        key={`title-${rowIndex}-${i}`}
                                        className={`flap-tile ${char === ' ' ? 'space' : ''}`}
                                        initial={{ rotateX: -90, opacity: 0 }}
                                        animate={{ rotateX: 0, opacity: 1 }}
                                        transition={{
                                            delay: (rowIndex + 1) * 0.15 + (ALBUM_TILES + 1 + i) * 0.02,
                                            duration: 0.3,
                                            type: "spring",
                                            stiffness: 200
                                        }}
                                    >
                                        <div className="flap-divider" />
                                        <div className="flap-content">{char}</div>
                                    </motion.div>
                                ))}

                                {/* Separator */}
                                <div className="flap-tile separator">
                                    <div className="flap-divider" />
                                </div>

                                {/* Artist tiles */}
                                {[...artistPadded.slice(0, ARTIST_TILES)].map((char, i) => (
                                    <motion.div
                                        key={`artist-${rowIndex}-${i}`}
                                        className={`flap-tile small ${char === ' ' ? 'space' : ''}`}
                                        initial={{ rotateX: -90, opacity: 0 }}
                                        animate={{ rotateX: 0, opacity: 1 }}
                                        transition={{
                                            delay: (rowIndex + 1) * 0.15 + (ALBUM_TILES + TITLE_TILES + 2 + i) * 0.02,
                                            duration: 0.3,
                                            type: "spring",
                                            stiffness: 200
                                        }}
                                    >
                                        <div className="flap-divider" />
                                        <div className="flap-content">{char}</div>
                                    </motion.div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    } catch (err) {
        console.error("Failed to fetch heavy rotation:", err);
    }
}

function FlapText({ text, small }) {
    return (
        <div className={`flap-row ${small ? "small" : ""}`}>
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
