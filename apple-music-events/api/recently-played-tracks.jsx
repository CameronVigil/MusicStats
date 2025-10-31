// recently-played-tracks.jsx

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
        console.log("Music Summaries:", data);
        return data;
    } catch (err) {
        console.error("Failed to fetch summaries:", err);
    }
};
