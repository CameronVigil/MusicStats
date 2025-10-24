import React, { useState, useEffect, useRef } from "react";
import fetchMusicSummaries from "/api/music-summaries" ;
import { startIdleTimer } from "./utils/idleTimer.js";

export default function App() {
  const [ready, setReady] = useState(false);
  const [signedIn, setsignedIn] = useState(false);
  const developerToken = useRef(null);
  const userToken = useRef(null);

  useEffect(() => {
    const initMusicKit = async () => {
      try {
        console.log("Starting MusicKit init");

        // Ensure SDK is loaded
        if (!window.MusicKit) {
          console.log("Loading MusicKit script");
          

          await new Promise((resolve) => {
            document.addEventListener("musickitloaded", () => {
              console.log("musickitloaded event fired");
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
                console.log("Storage access granted");
            } catch (err) {
                console.warn("Storage access denied", err);
            }
        }
        if (document.requestStorageAccess) {
            try {
                await document.requestStorageAccess();
                console.log("Storage access granted");
            } catch (err) {
                console.warn("Storage access denied", err);
            }
        }
        // Configure MusicKit
        window.MusicKit.configure({
          developerToken: data.token,
          app: { name: "MusicKit Demo", build: "1.0.0" },
        });
        
        console.log("MusicKit instance:", instance);

        if (instance) {
          setReady(true);
        }
      } catch (err) {
        console.error("MusicKit init error:", err);
      }
    };

    // start idle timer for x minutes
    startIdleTimer(handleSessionExpire, 2);
    initMusicKit();
  }, []);

  const handleSignIn = async () => {
    console.log("Sign-in");
    const instance = window.MusicKit?.getInstance();
    console.log("MusicKit instance:", instance);
    if (!instance) {
        console.error("MusicKit failed to initialize");
        return;
    }

    try {
        userToken.current = await instance.authorize();
        console.log("User Token:", userToken);
        setsignedIn(true)
    } catch (err) {
        console.error("Authorization failed:", err);
    }
  };

  const getTopArtists = async () => {
    console.log("Developer token:", developerToken);

    try {
        console.log("Developer token:", developerToken);
        console.log("User token:", userToken);

        const summaries = await fetchMusicSummaries(developerToken, userToken);
        console.log("Summaries data:", summaries);
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
          <button onClick={handleSignIn} disabled={!ready} hidden={ signedIn }>
        {ready ? "Sign in with Apple Music!" : "Loading..."}
          </button>
          <button onClick={getTopArtists} hidden={!signedIn}>
              {"Get Top Artists" }
          </button>
    </div>
  );
}
