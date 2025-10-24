// music-summaries.js

async function fetchMusicSummaries(developerToken, userToken) {
    try {
        const res = await fetch("https://api.music.apple.com/v1/me/music-summaries", {
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
}
export default fetchMusicSummaries;
