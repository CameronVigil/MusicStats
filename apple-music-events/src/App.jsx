import React, { useState, useEffect } from "react";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initMusicKit = async () => {
      try {
        console.log("🚀 Starting MusicKit init...");

        // ✅ Ensure SDK is loaded
        if (!window.MusicKit) {
          console.log("📦 Loading MusicKit script...");
          

          await new Promise((resolve) => {
            document.addEventListener("musickitloaded", () => {
              console.log("🎉 musickitloaded event fired!");
              resolve();
            });
          });
        }

        console.log("🎵 MusicKit object found:", window.MusicKit);
        const instance = JSON.stringify( window.MusicKit);
        // ✅ Fetch the developer token
        const res = await fetch("https://music-stats-7y55.vercel.app/api/apple-token");
        const data = await res.json();
        console.log("✅ Developer token returned:", data.token);

        // ✅ Configure MusicKit
        window.MusicKit.configure({
          developerToken: data.token,
          app: { name: "MusicKit Demo", build: "1.0.0" },
        });

        
        console.log("🎶 MusicKit instance:", instance);

        if (instance) {
          setReady(true);
        }
      } catch (err) {
        console.error("❌ MusicKit init error:", err);
      }
    };

    initMusicKit();
  }, []);

    const handleSignIn = async () => {
    console.log("✅ Sign-in...");
    const instance = window.MusicKit?.getInstance();
    console.log("🎶 MusicKit instance:", instance);
    if (!instance) {
      console.error("❌ MusicKit not ready — instance is null");
      return;
    }

    try {
      const userToken = await instance.authorize();
      console.log("🎉 User Token:", userToken);
      alert("✅ Sign-in successful!");
    } catch (err) {
      console.error("❌ Authorization failed:", err);
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>MusicKit Demo</h1>
      <button onClick={handleSignIn} disabled={!ready}>
        {ready ? "Sign in with Apple Music!" : "Loading..."}
      </button>
    </div>
  );
}
