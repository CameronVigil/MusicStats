import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    // ✅ Add CORS headers
    console.log("test6");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // ✅ Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    console.error("test6");
    try {
        console.error("test6");
        const teamId = "PC84YF525S";
        const keyId = "X324HMKBA9";
        const privateKey = process.env.APPLE_KEY.replace(/\\n/g, "\n");
        const token = jwt.sign(
          {},        privateKey,
          {
            algorithm: "ES256",
            expiresIn: "180d",
              issuer: teamId,
            header: {
              alg: "ES256",
                kid: keyId,
            },
          }
        );

        res.status(200).json({ token });
        console.log("Token generated:" + token);

    } catch (error) {
    console.error("Token generation failed:", error);
    res.status(500).json({ error: "Token generation failed" });
    }    
}


