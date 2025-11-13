// recently-played-tracks.jsx
import React from "react";
import { motion } from "framer-motion";
import SplitFlapBoard from "../src/split-board/split-flap-board";

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
        return <SplitFlapBoard items={items.slice(0, 10)} showAlbumArt={true} />;    
        
    } catch (err) {
        console.error("Failed to fetch summaries:", err);
    }
};
