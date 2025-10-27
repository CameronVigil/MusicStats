import React, { useState, useEffect, useRef } from "react";
import fetchRecentTracks from "/api/recently-played-tracks";
import fetchHeavyRotation from "/api/heavy-rotation";
import { startIdleTimer } from "./utils/idleTimer.js";
import './index.css';

export default function App() {
  const [ready, setReady] = useState(false);
  const [signedIn, setsignedIn] = useState(false);
  const developerToken = useRef(null);
  const userToken = useRef(null);
  const idleTime = 2;
  const [heavyRotation, setHeavyRotation] = useState([]);

  useEffect(() => {
    const initMusicKit = async () => {
      try {
        console.log("Starting MusicKit initialization.");

        // Ensure SDK is loaded
        if (!window.MusicKit) {
          console.log("Loading MusicKit script.");
          

          await new Promise((resolve) => {
            document.addEventListener("musickitloaded", () => {
              console.log("musickitloaded event fired.");
              resolve();
            });
          });
        }

        console.log("MusicKit object found:", window.MusicKit);
        const instance = JSON.stringify( window.MusicKit);
        // Fetch the developer token
        const res = await fetch("https://music-stats-7y55.vercel.app/api/apple-token");
        const data = await res.json();
        developerToken.current = data.token;

        console.log("Developer token returned:", developerToken);
        if (document.requestStorageAccess) {
            try {
                await document.requestStorageAccess();
                console.log("Storage access granted.");
            } catch (err) {
                console.warn("Storage access denied.", err);
            }
        }
        if (document.requestStorageAccess) {
            try {
                await document.requestStorageAccess();
                console.log("Storage access granted.");
            } catch (err) {
                console.warn("Storage access denied.", err);
            }
        }
        // Configure MusicKit
        window.MusicKit.configure({
          developerToken: data.token,
          app: { name: "MusicKit Demo", build: "1.0.0" },
        });
        
        if (!instance) {
            console.error("MusicKit failed to initialize.");
            return;
        } else {
            console.log("MusicKit instance created.");
            setReady(true);
        }
      } catch (err) {
        console.error("MusicKit init error:", err);
      }
    };
    // start idle timer for x minutes
    startIdleTimer(handleSessionExpire, idleTime);
    initMusicKit();
  }, []);

  const handleSignIn = async () => {
    console.log("Sign-in");
    const instance = window.MusicKit?.getInstance();
    
    if (!instance) {
        console.error("MusicKit failed to initialize.");
        return;
    } else {
        console.log("MusicKit instance created.");
    }

    try {
        userToken.current = await instance.authorize();
        console.log("User Token:", userToken);
        setsignedIn(true)
    } catch (err) {
        console.error("Authorization failed:", err);
    }
  };

  const getRecentTracks = async () => {
    try {
        const summaries = await fetchRecentTracks(developerToken.current, userToken.current);
        console.log("Summaries data:", summaries);
    } catch (err) {
        console.error("Sign-in or fetch failed:", err);
    }
    };

  const getHeavyRotation = async () => {
        try {
            const summaries = await fetchHeavyRotation(developerToken.current, userToken.current);
            console.log("Summaries data:", summaries);
            setHeavyRotation(summaries);
        } catch (err) {
            console.error("Sign-in or fetch failed:", err);
        }
  };

  function handleSessionExpire() {
    // Clear cookies
    document.cookie = "userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "developerToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    console.log("Cleared cookies due to inactivity");

    // Optional: revoke Apple Music authorization if supported
    if (window.MusicKit && window.MusicKit.getInstance().isAuthorized) {
        window.MusicKit.getInstance().unauthorize().then(() => {
            console.log("Apple Music authorization revoked");
            alert("Session expired. Please sign in again.");
            window.location.reload();
        });
    } else {
        alert("Session expired. Please sign in again.");
        window.location.reload();
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Music Stats</h1>
          <button
              onClick={handleSignIn}
              className={!signedIn ? "visible" : "hidden"}
          >
            {ready ? "Sign in with Apple Music" : "Loading..."}
          </button>
          <button
              onClick={getRecentTracks}
              className={signedIn ? "visible" : "hidden"}
          >
            {"Recently Played Tracks" }
          </button>
          <button
              onClick={getHeavyRotation}
              className={signedIn ? "visible" : "hidden"}
          >
              {"Heavy Rotation"}
          </button>
          <h1
              className={signedIn ? "heavyRotation" : "hidden"}
          >
              { heavyRotation }
          </h1>
          
    </div>
  );
}
