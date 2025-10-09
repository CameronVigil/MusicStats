import fs from "fs";

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
        const keyId = "9B83MQYGSJ";
       /*
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
    */
        with open("./AuthKey_X324HMKBA9.p8", "r") as f:
        private_key = f.read()
        team_id = teamId
        client_id = "bundle.id"
        key_id = keyId
        validity_minutes = 20
        timestamp_now = int(time.time())
        timestamp_exp = timestamp_now + (60 * validity_minutes)
        # Assuming `last_token_expiration` is a class variable defined somewhere else
        # cls.last_token_expiration = timestamp_exp
        data = {
            "iss": team_id,
            "iat": timestamp_now,
            "exp": timestamp_exp,
            "aud": "https://appleid.apple.com",
            "sub": client_id
        }
        token = jwt.encode(
            payload = data,
            key = private_key.encode('utf-8'),
            algorithm = "ES256",
            headers = { "kid": key_id }
        )









    res.status(200).json({ token });
  } catch (error) {
    console.error("Token generation failed:", error);
    res.status(500).json({ error: "Token generation failed" });
  }
}


