import React, { useState, useEffect, useRef } from "react";
import fetchRecentTracks from "/api/recently-played-tracks";
import fetchHeavyRotation from "/api/heavy-rotation";
import fetchMusicSummaries from "/api/music-summaries";
import { startIdleTimer } from "./utils/idleTimer.js";
import './index.css';


export default function App() {
    const [ready, setReady] = useState(false);
    const [signedIn, setsignedIn] = useState(false);
    const developerToken = useRef(null);
    const userToken = useRef(null);
    const idleTime = 50;
    const [DisplayData, setDisplayData] = useState([]);
    // Variable to set the app to developer mode, preserving login data
    const [developerMode, setdeveloperMode] = useState(false);


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
          setDisplayData(null);
          const data = await fetchRecentTracks(developerToken.current, userToken.current);
          console.log("Recent tracks data:", data);
          setDisplayData(data);
    } catch (err) {
        console.error("Sign-in or fetch failed:", err);
    }
  };

  const getHeavyRotation = async () => {
      try {
          setDisplayData(<div className="board-container">
              <div className="board-content">
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      Loading...
                  </div>
              </div>
          </div>);
          const data = await fetchHeavyRotation(developerToken.current, userToken.current);
          console.log("Heavy rotation data:", data);
          setDisplayData(data);
    } catch (err) {
          console.error("Sign-in or fetch failed:", err);
    }
  };

  const getMusicSummaries = async () => {
      try {
        setDisplayData(null);
        console.log("Retrieving summaries from API.");
        const res = await fetch(
            "https://music-stats-7y55.vercel.app/api/music-summaries?developerToken=" + developerToken.current +"&userToken="+userToken.current
        );
          console.log("Retrieved summaries from API.");
          const data = await res.json();
          console.log("Summaries data:", data);
          setDisplayData(data.data);
    } catch (err) {
        console.error("Sign-in or fetch failed:", err);
    }
  };
    // Add this new component before your App component
    function BlinkingPeriod() {
        const [showPeriod, setShowPeriod] = useState(true);
        const [showMusicNote, setShowMusicNote] = useState(false);

        useEffect(() => {
            // Blink every second
            const blinkInterval = setInterval(() => {
                setShowPeriod(prev => !prev);
            }, 1000);

            // Occasionally show music note (every 10 seconds, 80% chance)
            const noteInterval = setInterval(() => {
                if (Math.random() < 0.8) {
                    setShowMusicNote(true);
                    setTimeout(() => setShowMusicNote(false), 2000); // Show for 2 seconds
                }
            }, 10000);

            return () => {
                clearInterval(blinkInterval);
                clearInterval(noteInterval);
            };
        }, []);

        return (
            <span style={{
                display: 'inline-block',
                width: '0.8em', // Fixed width instead of minWidth
                opacity: showPeriod ? 1 : 0,
                transition: 'opacity 0.1s ease',
                fontSize: showMusicNote ? '0.5em' : '0.6em',
                filter: showMusicNote ? 'grayscale(100%) brightness(0)' : 'none',
                verticalAlign: 'baseline',
                lineHeight: 1
            }}>
                {showMusicNote ? '🎵' : '🎵'}
            </span>
        );
    }
    const handleRefresh = async () => {
        console.log("Refresh");
        window.location.reload();
    };
  return (
    <div style={{ padding: 50 }}>
          <button
              onClick={handleRefresh}
              className={"title"}
          >Music Stats<BlinkingPeriod /></button>
          
          <button
              onClick={handleSignIn}
              className={!signedIn ? "visible" : "hidden"}
          >
            {ready ? "Sign in with Apple Music" : "Loading..."}
          </button>
          <div style={{  textAlign: 'center' }}>
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
              <button
                  onClick={getMusicSummaries}
                  className={signedIn ? "visible" : "hidden"}
              >
                  {"Music Summaries"}
                  </button>
          </div>
          <div>{DisplayData}</div>          
    </div>
  );
}
