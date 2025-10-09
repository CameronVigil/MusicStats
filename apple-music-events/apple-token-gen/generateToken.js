// generateToken.js
import fs from "fs";
import jwt from "jsonwebtoken";

// 🔑 Update these values with your info
const teamId = "PC84YF525S";
const keyId = "9B83MQYGSJ";
const privateKey = fs.readFileSync("./AuthKey_9B83MQYGSJ.p8").toString();

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

console.log("Your Apple Developer Token:\n", token);
