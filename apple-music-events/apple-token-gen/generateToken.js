// generateToken.js
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.get("/api/apple-token", (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        // 🔑 Update these values with your info
        const teamId = "PC84YF525S";
        const keyId = "9B83MQYGSJ";
        const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n");
        const token = jwt.sign(
            {
                iss: teamId,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 15777000, // ~6 months
            },
            privateKey,
            {
                algorithm: "ES256",
                keyid: keyId,
            }
        );
        res.json({ token });
        console.log("Your Apple Developer Token:\n", token);
    } catch (error) {
        console.error("❌ Token generation failed:", error);
        res.status(500).json({ error: "Token generation failed" });
    }
});



const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Apple token server running on port ${PORT}`));