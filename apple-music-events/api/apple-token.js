import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    // ✅ CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const teamId = "PC84YF525S"; // your Apple Developer Team ID
        const keyId = "9B83MQYGSJ";
        const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n");

        const token = jwt.sign(
            {
                iss: teamId,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 15777000, // 6 months
            },
            privateKey,
            {
                algorithm: "ES256",
                header: { alg: "ES256", kid: keyId },
            }
        );

        res.status(200).json({ token });
        console.log("✅ Developer Token:", token);
    } catch (error) {
        console.error("❌ Token generation failed:", error);
        res.status(500).json({ error: "Token generation failed" });
    }
}
