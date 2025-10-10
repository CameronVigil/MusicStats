import React, { useState, useEffect } from "react";

export default function App() {
    const [music, setMusic] = useState(null);

    useEffect(() => {
        const initMusicKit = async () => {
            try {
                // 1️⃣ Fetch the developer token from your backend
                const res = await fetch("https://music-stats-7y55.vercel.app/api/apple-token");
                const data = await res.json();
                if (!data.token) throw new Error("No developer token received");

                console.log("✅ Developer Token:", data.token);

                // 2️⃣ Wait for MusicKit to load
                const configureMusicKit = () => {
                    window.MusicKit.configure({
                        developerToken: data.token,
                        app: {
                            name: "MusicKit Demo",
                            build: "1.0.0",
                        },
                    });
                    setMusic(window.MusicKit.getInstance());
                    console.log("🎵 MusicKit configured successfully");
                };

                if (window.MusicKit) {
                    configureMusicKit();
                } else {
                    document.addEventListener("musickitloaded", configureMusicKit);
                }
            } catch (err) {
                console.error("MusicKit init error:", err);
            }
        };

        initMusicKit();
    }, []);

    const handleSignIn = async () => {
        if (!music) {
            console.error("❌ MusicKit not ready");
            return;
        }

        try {
            console.log("🚀 Authorizing with MusicKit...");
            const userToken = await music.authorize();
            console.log("🎉 User Token:", userToken);
            alert("Sign-in successful!");
        } catch (err) {
            console.error("Authorization failed:", err);
        }
    };

    return (
        <div style={{ padding: 50 }}>
            <h1>MusicKit Demo</h1>
            <button onClick={handleSignIn}>Sign in with Apple Music!</button>
        </div>
    );
}
