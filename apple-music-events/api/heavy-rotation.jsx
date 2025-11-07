import React from "react";
import { motion } from "framer-motion";

import SplitFlapBoard from "../src/components/split-flap-board";
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
                
        return <SplitFlapBoard items={items} showAlbumArt={true} />;
        
    } catch (err) {
        console.error("Failed to fetch heavy rotation:", err);
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
