import React, { useState, useEffect } from "react";
import './App.css'


export default function App() {
    const [music, setMusic] = useState(null);

    useEffect(() => {
        const initMusicKit = async () => {
            try {
                console.log("data1");
                const res = await fetch("https://music-stats-7y55.vercel.app/api/apple-token");
                console.log("data2");
                const data = await res.json();
                console.log("data");
                console.log(data);
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