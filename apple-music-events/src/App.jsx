import React, { useState, useEffect } from "react";
import './App.css'


export default function App() {
    const [music, setMusic] = useState(null);

    useEffect(() => {
        const initMusicKit = async () => {
            try {
                const res = await fetch("https://music-stats-7y55.vercel.app/api/apple-token");
                console.log("📦 Response status:", res.status);

                const text = await res.text();
                console.log("🧾 Raw response:", text);

                let data;
                try {
                    data = JSON.parse(text);
                } catch {
                    console.error("❌ Response was not JSON!");
                    return;
                }
                console.log("✅ Developer Token received:", data.token);

                if (!data.token) throw new Error("No token returned from API");

                const configureMusicKit = () => {
                    const musicInstance = window.MusicKit.configure({
                        developerToken: data.token,
                        app: { name: "MusicKit Demo", build: "1.0.0" },
                    });
                    setMusic(musicInstance);
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
        if (!music) return console.error("MusicKit not ready");
        try {
            const userToken = await music.authorize();
            console.log("User token:", userToken);
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
    )
}